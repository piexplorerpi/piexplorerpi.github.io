import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// دریافت تمام اپلیکیشن‌ها
router.get('/apps', async (req, res) => {
  try {
    const apps = await prisma.app.findMany({
      orderBy: {
        createdAt: 'desc', // جدیدترین‌ها اول
      },
    });
    res.json(apps);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch apps' });
  }
});

// اضافه کردن یک اپلیکیشن جدید (برای مدیریت توسط ادمین یا دیتابیس)
router.post('/apps', async (req, res) => {
  try {
    const newApp = await prisma.app.create({
      data: req.body,
    });
    res.status(201).json(newApp);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to create app' });
  }
});

export default router;
