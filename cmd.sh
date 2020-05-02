#!/bin/bash
set -e

if [ "$NODE_ENV" = "production" ]
then
  echo "NODE_ENV=production"
  exec npm start
else
  echo "NODE_ENV=development"
  exec npm run dev
fi
