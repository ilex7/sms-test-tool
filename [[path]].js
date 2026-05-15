/**
 * Cloudflare Pages Function - 增强版 CORS 代理服务
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;
  const hasUrlParam = url.searchParams.has("url");

  // 静态资源绕过
  if ((pathname === "/" && !hasUrlParam) || pathname === "/index.html") {
    return context.next();
  }

  // 获取目标 URL
  let targetUrl = url.searchParams.get("url");
  if (!targetUrl) {
    const candidate = pathname.startsWith("/") ? pathname.slice(1) : pathname;
    if (candidate.startsWith("http")) {
      targetUrl = decodeURIComponent(candidate) + url.search;
    }
  }

  // OPTIONS 预检
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: getCORSHeaders() });
  }

  if (!targetUrl) {
    return context.next();
  }

  try {
    const decodedUrl = targetUrl.startsWith("http") ? targetUrl : decodeURIComponent(targetUrl);
    
    // 读取请求体
    const requestBody = request.method !== 'GET' && request.method !== 'HEAD' 
      ? await request.text() 
      : undefined;

    // 构建请求头（复制原始请求头）
    const headers = new Headers();
    for (const [key, value] of request.headers) {
      if (!['host', 'origin', 'referer'].includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    }
    
    // 确保必要的请求头存在
    if (!headers.has('Content-Type') && requestBody) {
      headers.set('Content-Type', 'application/x-www-form-urlencoded');
    }

    // 发起代理请求（30秒超时）
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(decodedUrl, {
      method: request.method,
      headers: headers,
      body: requestBody,
      redirect: "follow",
      signal: controller.signal,
      cf: { cacheTtl: 0 },
    });

    clearTimeout(timeoutId);

    // 返回响应
    const responseHeaders = new Headers(response.headers);
    const corsHeaders = getCORSHeaders();
    for (const [key, value] of Object.entries(corsHeaders)) {
      responseHeaders.set(key, value);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('代理错误:', error);
    return new Response(`代理失败: ${error.message}`, {
      status: error.name === 'AbortError' ? 504 : 502,
      headers: getCORSHeaders(),
    });
  }
}

function getCORSHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Max-Age": "86400",
  };
}
