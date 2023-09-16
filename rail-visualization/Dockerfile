FROM node:16.20.1
COPY  . /home/rail-visualization

WORKDIR /home/rail-visualization

RUN npm install

RUN npm run build

CMD ["npm", "start"]