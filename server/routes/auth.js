import express from 'express';
import { Admin } from '../models/Admin.js';
import { Student } from '../models/Student.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import axios from 'axios';

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { username, password, role, captchaToken } = req.body;

        // Verify captcha token
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`
        );

        if (!response.data.success) {
            return res.json({ message: 'Failed captcha verification' });
        }

        if (role === 'admin') {
            const admin = await Admin.findOne({ username });
            if (!admin) {
                return res.json({ message: 'Admin not registered' });
            }
            const validPassword = await bcrypt.compare(password, admin.password);
            if (!validPassword) {
                return res.json({ message: 'Wrong password' });
            }
            const token = jwt.sign({ username: admin.username, role: 'admin' }, process.env.Admin_Key);
            res.cookie('token', token, { httpOnly: true, secure: false });
            return res.json({ login: true, role: 'admin' });
        } else if (role === 'student') {
            const student = await Student.findOne({ username });
            if (!student) {
                return res.json({ message: 'Student not registered' });
            }
            const validPassword = await bcrypt.compare(password, student.password);
            if (!validPassword) {
                return res.json({ message: 'Wrong password' });
            }
            const token = jwt.sign({ username: student.username, role: 'student' }, process.env.Student_Key);
            res.cookie('token', token, { httpOnly: true, secure: false });
            return res.json({ login: true, role: 'student' });
        } else {
            return res.json({ message: 'Invalid role selected' });
        }
    } catch (err) {
        res.json(err);
    }
});

export const verifyAdmin = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ message: 'Invalid Admin' });
    } else {
        jwt.verify(token, process.env.Admin_Key, (err, decoded) => {
            if (err) {
                return res.json({ message: 'Invalid token' });
            } else {
                req.username = decoded.username;
                req.role = decoded.role;
                next();
            }
        });
    }
};

export const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ message: 'Invalid User' });
    } else {
        jwt.verify(token, process.env.Admin_Key, (err, decodedAdmin) => {
            console.log(decodedAdmin);
            
            if (err) {
                jwt.verify(token, process.env.Student_Key, (err, decodedStudent) => {
                    console.log(decodedStudent);
                    if (err) {
                        return res.json({ message: 'Invalid token' });
                    } else {
                        req.username = decodedStudent.username;
                        req.role = decodedStudent.role;
                        next();
                    }
                });
            } else {
                req.username = decodedAdmin.username;
                req.role = decodedAdmin.role;
                next();
            }
        });
    }
};

router.get('/verify', verifyUser, (req, res) => {
    return res.json({ login: true, role: req.role });
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ logout: true });
});
export { router as AdminRouter };