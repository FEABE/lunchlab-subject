# 런치랩 백엔드 과제

# 런치랩 백엔드 과제

## 실행 방법

### 1. 환경 설정
1. 환경 변수 설정
```bash
# .env 파일 생성
cp .env
```

.env 파일 내용:
- 별도 전달 예정

### 2. Docker 설정
```bash
# PostgreSQL 컨테이너 실행
docker-compose up -d
```

### 3. 프로젝트 설정
1. 패키지 설치
```bash
pnpm install
```

2. 데이터베이스 설정
```bash
# PostgreSQL 데이터베이스 생성 및 마이그레이션 적용
pnpm dlx prisma migrate dev

# 초기 데이터 생성 (관리자 계정 및 기본 상품)
pnpm dlx prisma db seed
```

3. 애플리케이션 실행
```bash
# 개발 모드
pnpm run start:dev

# 프로덕션 모드
pnpm run build
pnpm run start:prod
```

### Swagger API 문서
- 서버 실행 후 다음 주소에서 API 문서 확인 가능:
- http://localhost:1777/api

## 구현 사항

### 1. 데이터베이스 설계
- PostgreSQL과 Prisma ORM 사용
- 사용자, 상품, 주문 관리를 위한 테이블 설계
- 확장성을 고려한 관계 설정

### 2. 사용자 관리 (Users) - 현재 구현 중
- [x] 회원가입 API 구현
  - 사용자 정보 유효성 검사
  - 비밀번호 암호화
  - 중복 사용자 확인
- [ ] 로그인 API 구현 (예정)
- [ ] 사용자 정보 조회 API 구현 (예정)

## 향후 개선사항

### 데이터 모델 확장성
현재 구현에서는 회사명(company)을 User 테이블의 단순 문자열 필드로 저장하고 있습니다. 실제 프로덕션 환경에서는 다음과 같은 이유로 별도의 Company 테이블 구현이 권장됩니다:

1. 데이터 정규화
   - 회사 정보 중복 방지
   - 회사명 일관성 유지
   - 회사 정보 업데이트 용이성

2. 확장 가능한 회사 정보
   - 회사 주소
   - 사업자 등록번호
   - 회사 규모
   - 업종 정보
   - 등록일/수정일

### 금액 데이터 타입
현재 구현에서는 한국 원화 특성상 Int 타입을 사용했습니다. 향후 다음과 같은 상황에서는 Decimal 타입으로의 마이그레이션을 고려해야 합니다:

1. 해외 통화 지원 시 (소수점 필요)
2. 대규모 거래 처리 시 (BigInt 고려)
3. 복잡한 할인 정책 적용 시
4. 정확한 금액 계산이 필요한 회계 시스템 연동 시

## 기술 스택
- NestJS
- PostgreSQL
- Prisma ORM
- JWT Authentication (예정)
- Swagger UI