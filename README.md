# Next.js Auth (Email/Password + GitHub) with Role-Based Access Control

โปรเจกต์ Next.js (App Router) + Auth.js (next-auth v5 beta) + Prisma 6 + SQLite

- สมัครสมาชิก `/signup` และ Login ด้วย Email/Password (เข้ารหัสด้วย bcrypt)
- Login ด้วย GitHub OAuth
- Role: `ADMIN`, `STAFF`, `USER` — หน้า `/admin` เข้าได้เฉพาะ ADMIN

## วิธีรัน (ทำตามลำดับ)

```bash
# 1) ติดตั้ง (จะรัน prisma generate ให้อัตโนมัติ)
npm install

# 2) สร้างไฟล์ .env แล้วแก้ค่า
cp .env.example .env
npx auth secret          # สร้าง AUTH_SECRET (หรือใส่ค่าสุ่มเองใน .env)

# 3) สร้างฐานข้อมูล
npm run db:migrate

# 4) สร้างบัญชี ADMIN สำหรับทดสอบ (admin@example.com / admin123)
npm run db:seed

# 5) รัน
npm run dev
```

เปิด http://localhost:3000

> ใช้ `npm run ...` ตามด้านบน ไม่ต้องพิมพ์ `npx prisma ...` เอง เพราะ `npx` อาจดึง Prisma เวอร์ชันใหม่กว่าที่โปรเจกต์ใช้ (โปรเจกต์นี้ล็อกไว้ที่ Prisma 6)

## GitHub Login

สร้าง OAuth App ที่ GitHub → Settings → Developer settings → OAuth Apps → New OAuth App

- Homepage URL: `http://localhost:3000`
- Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

แล้วใส่ Client ID / Secret ใน `.env` เป็น `AUTH_GITHUB_ID` และ `AUTH_GITHUB_SECRET`

## วิธีทดสอบ

1. `/signup` สมัครบัญชีใหม่ → ได้ role `USER` → ถูกส่งไป `/login`
2. ล็อกอินด้วย USER แล้วเข้า `/admin` → ถูกส่งไป `/unauthorized`
3. ล็อกอินด้วย `admin@example.com` / `admin123` แล้วเข้า `/admin` → เห็น Admin Dashboard
4. ยังไม่ล็อกอินแล้วเข้า `/admin` → ถูกส่งไป `/login`
5. กด "Sign in with Github" → ล็อกอินได้ (role `USER`)

## โครงสร้างไฟล์หลัก

```
app/auth.ts                         ตั้งค่า Auth.js (Credentials + GitHub, JWT, role)
app/api/auth/[...nextauth]/route.ts
app/login/page.tsx                  หน้า Login (+ปุ่ม GitHub)
app/login-github/page.tsx           หน้า Login เฉพาะ GitHub
app/signup/{page.tsx,actions.ts}    สมัครสมาชิก
app/admin/page.tsx                  เฉพาะ ADMIN
app/unauthorized/page.tsx
app/lib/prisma.ts
types/next-auth.d.ts                เพิ่มชนิดข้อมูล id / role
prisma/schema.prisma, prisma/seed.mjs
```

## สิ่งที่แก้จากเอกสารต้นฉบับ

- `signup/actions.ts`: ต้นฉบับตั้ง `role: "ADMIN"` ทำให้ทุกคนที่สมัครเป็นแอดมิน แก้เป็น `"USER"`
- เพิ่ม `types/next-auth.d.ts` ให้ `session.user.role` ผ่าน TypeScript
- รวม `auth.ts` (Credentials + GitHub) และ lowercase email ตอน login ให้ตรงกับตอนสมัคร
- `login/page.tsx`: รวมปุ่ม GitHub, ข้อความหลังสมัครสำเร็จ, ห่อ `useSearchParams` ด้วย `Suspense`
- `unauthorized/page.tsx`: ลิงก์ `/dashboard` (ไม่มีหน้านี้) เปลี่ยนเป็น `/`
- `admin/page.tsx` และหน้าแรก: เพิ่มปุ่ม Logout
- เพิ่ม `prisma/seed.mjs` สร้างแอดมินสำหรับทดสอบ
