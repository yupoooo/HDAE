import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface NewUser {
  name: string;
  email: string;
  pass: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  signup: (newUser: NewUser) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DAHC_USERS_DB_KEY = 'dahc-users-db';
const DAHC_CURRENT_USER_KEY = 'dahc-user';

// دالة للحصول على قاعدة بيانات المستخدمين الوهمية
const getUsersDB = (): Record<string, any> => {
  const db = localStorage.getItem(DAHC_USERS_DB_KEY);
  return db ? JSON.parse(db) : {};
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // التحقق من وجود جلسة محفوظة عند تحميل التطبيق
    const savedUser = localStorage.getItem(DAHC_CURRENT_USER_KEY);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const db = getUsersDB();
        const userInDb = db[email.toLowerCase()];

        if (userInDb && userInDb.password === pass) {
          const loggedInUser: User = {
            id: userInDb.id,
            name: userInDb.name,
            email: userInDb.email,
          };
          localStorage.setItem(DAHC_CURRENT_USER_KEY, JSON.stringify(loggedInUser));
          setUser(loggedInUser);
          setIsAuthenticated(true);
          resolve();
        } else {
          reject(new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة.'));
        }
      }, 1000);
    });
  };

  const signup = async (newUser: NewUser): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const db = getUsersDB();
            const emailKey = newUser.email.toLowerCase();

            if (db[emailKey]) {
                return reject(new Error('هذا البريد الإلكتروني مسجل بالفعل.'));
            }

            const newUserId = `user-${Date.now()}`;
            db[emailKey] = {
                id: newUserId,
                name: newUser.name,
                email: newUser.email,
                password: newUser.pass,
            };
            
            localStorage.setItem(DAHC_USERS_DB_KEY, JSON.stringify(db));

            // تسجيل دخول المستخدم تلقائيًا بعد إنشاء الحساب
            const loggedInUser: User = {
                id: newUserId,
                name: newUser.name,
                email: newUser.email,
            };
            localStorage.setItem(DAHC_CURRENT_USER_KEY, JSON.stringify(loggedInUser));
            setUser(loggedInUser);
            setIsAuthenticated(true);
            
            resolve();
        }, 1000);
    });
  };


  const logout = () => {
    localStorage.removeItem(DAHC_CURRENT_USER_KEY);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
