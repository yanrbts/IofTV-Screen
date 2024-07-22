# 使用 Nginx 作为生产环境的 Web 服务器
FROM nginx:alpine

# 复制打包好的 Vue.js 应用到 Nginx 服务器的默认目录
COPY dist /usr/share/nginx/html

# 暴露 Nginx 默认端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
