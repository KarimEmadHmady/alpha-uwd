// app.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import mysqlSession from 'express-mysql-session';
import categoryRoutes from "./routes/category.routes.js";
import userRoutes from "./routes/user.routes.js";
import fundRoutes from "./routes/fund.routes.js";
import fundManagerRoutes from "./routes/fund-manager.routes.js";
import entityRoutes from "./routes/entity.routes.js";
import documentRoutes from "./routes/document.routes.js";
import pageContentRoutes from "./routes/page-content.routes.js";
import careerRoutes from "./routes/career.routes.js";
import errorHandler from './middlewares/error.middleware.js';
import con from './config/index.js';

const app = express();

// Setup __dirname for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define uploads path
const uploadsPath = '/home2/alphaodinnew/back.alpha/uploads';

const corsOptions = {
    origin: [
        'http://revamp.alpha-odin.com',
        'https://revamp.alpha-odin.com',
    ],
    credentials: true,           // مهم للـ session/cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
        res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');
        res.header('Access-Control-Allow-Credentials', 'true');
        return res.sendStatus(204);
    }
    next();
});


app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore(con.config);

app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,       // HTTPS فقط
        sameSite: 'none',   // مهم للـ cross-origin requests
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 24 ساعة
    }
}));

// ✅ 4. Logger
app.use(morgan('dev'));

// ✅ 5. Static files
app.use('/alpha/uploads', express.static(uploadsPath));

// Test route to check uploads
app.get('/alpha/test-uploads', (req, res) => {
    try {
        if (!fs.existsSync(uploadsPath)) {
            return res.json({
                success: 0,
                message: 'Uploads folder does not exist',
                uploadsPath: uploadsPath
            });
        }

        const files = fs.readdirSync(uploadsPath);

        res.json({
            success: 1,
            uploadsPath: uploadsPath,
            totalFiles: files.length,
            files: files.slice(0, 10),
            sampleUrl: files.length > 0 ? `https://revamp.alpha-odin.com/alpha/uploads/${files[0]}` : null
        });
    } catch (error) {
        res.status(500).json({
            success: 0,
            uploadsPath: uploadsPath,
            error: error.message
        });
    }
});

// Ping route
app.get('/alpha/ping', (req, res) => {
    res.send('Server is running ✅');
});

// Welcome page for /alpha
app.get('/alpha', (req, res) => {
    res.send('Welcome to Alpha API');
});

// ✅ 6. API Routes under /alpha
app.use('/alpha/api/categories', categoryRoutes);
app.use('/alpha/api/users', userRoutes);
app.use('/alpha/api/funds', fundRoutes);
app.use('/alpha/api/fund-managers', fundManagerRoutes);
app.use('/alpha/api/entities', entityRoutes);
app.use('/alpha/api/documents', documentRoutes);
app.use('/alpha/api/page-content', pageContentRoutes);
app.use('/alpha/api/careers', careerRoutes);

app.use(errorHandler);

export default app;