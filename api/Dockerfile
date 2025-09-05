FROM node:20-alpine
WORKDIR /app
RUN npm i -g json-server
# keep a default copy inside the image (optional)
COPY db.json /data/db.json
EXPOSE 3001
CMD ["json-server", "--watch", "/data/db.json", "--host", "0.0.0.0", "--port", "3001"]
