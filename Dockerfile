FROM ccr.ccs.tencentyun.com/violin/nginx:latest

COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
