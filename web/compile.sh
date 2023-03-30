rm -rf /app/dbdiagram-oss/web/dist/*
rm -rf /usr/share/nginx/html/*

yarn run build
cp -r /app/dbdiagram-oss/web/dist/spa /usr/share/nginx/html
mv /usr/share/nginx/html/spa /usr/share/nginx/html/dbdiagram-oss 