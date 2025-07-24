#!/bin/bash

set -e  # 에러 발생 시 스크립트 즉시 종료


echo "🚀 [Deploy] 서버 배포를 시작합니다..."
cd /home/ec2-user/backend

echo "📦 [Docker] 최신 이미지 Pull 중..."
docker-compose pull

echo "🧼 [Docker] 기존 컨테이너 종료 중..."
docker-compose down

echo "🚀 [Docker] 새로운 컨테이너 실행 중..."
docker-compose up -d

echo "✅ [Deploy] 배포 완료!"

# # 최초 1회만 실행!
# docker exec backend npm run prisma:deploy
# echo "[Seed] 시드 완료! 다음 배포 때는 주석처리 할 것!"