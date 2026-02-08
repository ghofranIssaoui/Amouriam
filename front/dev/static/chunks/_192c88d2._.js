(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/auth-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/cookies-next/lib/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
const API_URL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [csrfToken, setCsrfToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [pending2FAUser, setPending2FAUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Fetch CSRF token on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const fetchCsrfToken = {
                "AuthProvider.useEffect.fetchCsrfToken": async ()=>{
                    try {
                        const response = await fetch('/api/auth/csrf', {
                            credentials: 'include'
                        });
                        const data = await response.json();
                        setCsrfToken(data.csrfToken);
                    } catch (error) {
                        console.error('Failed to fetch CSRF token:', error);
                    }
                }
            }["AuthProvider.useEffect.fetchCsrfToken"];
            fetchCsrfToken();
        }
    }["AuthProvider.useEffect"], []);
    // Load user data on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const loadUser = {
                "AuthProvider.useEffect.loadUser": async ()=>{
                    try {
                        const apiUrl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
                        const response = await fetch(`${apiUrl}/api/auth/me`, {
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-Token': csrfToken || ''
                            }
                        });
                        if (response.ok) {
                            const userData = await response.json();
                            setUser(userData);
                        }
                    } catch (error) {
                        console.error('Failed to load user:', error);
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["AuthProvider.useEffect.loadUser"];
            if (csrfToken) {
                loadUser();
            }
        }
    }["AuthProvider.useEffect"], [
        csrfToken
    ]);
    // Login function with rate limiting
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[login]": async (email, password, code)=>{
            try {
                setError(null);
                setIsLoading(true);
                // Get CSRF token first
                const apiUrl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
                const csrfResponse = await fetch(`${apiUrl}/api/auth/csrf`);
                const { csrfToken } = await csrfResponse.json();
                setCsrfToken(csrfToken);
                // Prepare login data
                const loginData = {
                    email,
                    password
                };
                if (code) {
                    loginData.code = code;
                }
                // Attempt to log in
                const response = await fetch(`${apiUrl}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'CSRF-Token': csrfToken
                    },
                    credentials: 'include',
                    body: JSON.stringify(loginData)
                });
                const responseData = await response.json();
                if (response.status === 206) {
                    // 206 Partial Content - 2FA required
                    setPending2FAUser({
                        email,
                        userId: responseData.userId
                    });
                    return {
                        requires2FA: true,
                        user: responseData.user
                    };
                }
                if (!response.ok) {
                    throw new Error(responseData.message || 'Login failed');
                }
                // Regular successful login
                setUser(responseData);
                setPending2FAUser(null);
                // Store user data in localStorage (excluding sensitive info)
                localStorage.setItem('user', JSON.stringify({
                    _id: responseData._id,
                    email: responseData.email,
                    name: responseData.name,
                    isAdmin: responseData.isAdmin,
                    is2FAEnabled: responseData.is2FAEnabled
                }));
                // Redirect to home page or intended URL
                const returnTo = new URLSearchParams(window.location.search).get('returnTo');
                router.push(returnTo || '/');
                return {
                    requires2FA: false
                };
            } catch (err) {
                setError(err.message || 'Failed to log in');
                throw err;
            } finally{
                setIsLoading(false);
            }
        }
    }["AuthProvider.useCallback[login]"], [
        router
    ]);
    const verify2FA = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[verify2FA]": async (userId, code)=>{
            try {
                setError(null);
                setIsLoading(true);
                if (!csrfToken) {
                    throw new Error('CSRF token not found');
                }
                const apiUrl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
                const response = await fetch(`${apiUrl}/api/auth/verify-2fa`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'CSRF-Token': csrfToken
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        userId,
                        code
                    })
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || '2FA verification failed');
                }
                const userData = await response.json();
                setUser(userData);
                setPending2FAUser(null);
                // Update user data in localStorage
                localStorage.setItem('user', JSON.stringify({
                    _id: userData._id,
                    email: userData.email,
                    name: userData.name,
                    isAdmin: userData.isAdmin,
                    is2FAEnabled: userData.is2FAEnabled
                }));
                // Redirect to home page or intended URL
                const returnTo = new URLSearchParams(window.location.search).get('returnTo');
                router.push(returnTo || '/');
            } catch (err) {
                setError(err.message || 'Failed to verify 2FA code');
                throw err;
            } finally{
                setIsLoading(false);
            }
        }
    }["AuthProvider.useCallback[verify2FA]"], [
        csrfToken,
        router
    ]);
    // Signup function with validation
    const signup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[signup]": async (email, password, name)=>{
            setIsLoading(true);
            setError(null);
            try {
                // Input validation
                if (!email || !password || !name) {
                    throw new Error('All fields are required');
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    throw new Error('Please enter a valid email address');
                }
                if (password.length < 8) {
                    throw new Error('Password must be at least 8 characters long');
                }
                const apiUrl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
                const response = await fetch(`${apiUrl}/api/auth/register`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrfToken || ''
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        name
                    })
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Registration failed');
                }
                // Auto-login after successful registration
                await login(email, password);
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred during registration';
                setError(errorMessage);
                throw error;
            } finally{
                setIsLoading(false);
            }
        }
    }["AuthProvider.useCallback[signup]"], [
        csrfToken,
        login
    ]);
    // Logout function
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[logout]": async ()=>{
            try {
                const apiUrl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
                await fetch(`${apiUrl}/api/auth/logout`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'X-CSRF-Token': csrfToken || ''
                    }
                });
            } catch (error) {
                console.error('Logout error:', error);
            } finally{
                // Clear client-side state
                setUser(null);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteCookie"])('auth_token');
                router.push('/login');
            }
        }
    }["AuthProvider.useCallback[logout]"], [
        csrfToken,
        router
    ]);
    // Check if user is authenticated
    const isAuthenticated = !!user;
    // Auto-logout on inactivity
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            if (!user) return;
            const events = [
                'mousedown',
                'mousemove',
                'keypress',
                'scroll',
                'touchstart'
            ];
            let timer;
            const resetTimer = {
                "AuthProvider.useEffect.resetTimer": ()=>{
                    clearTimeout(timer);
                    timer = setTimeout({
                        "AuthProvider.useEffect.resetTimer": ()=>{
                            logout();
                        }
                    }["AuthProvider.useEffect.resetTimer"], 30 * 60 * 1000); // 30 minutes of inactivity
                }
            }["AuthProvider.useEffect.resetTimer"];
            // Set up event listeners
            events.forEach({
                "AuthProvider.useEffect": (event)=>{
                    window.addEventListener(event, resetTimer);
                }
            }["AuthProvider.useEffect"]);
            // Initial timer
            resetTimer();
            return ({
                "AuthProvider.useEffect": ()=>{
                    clearTimeout(timer);
                    events.forEach({
                        "AuthProvider.useEffect": (event)=>{
                            window.removeEventListener(event, resetTimer);
                        }
                    }["AuthProvider.useEffect"]);
                }
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], [
        user,
        logout
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            login,
            verify2FA,
            signup,
            logout,
            isLoading,
            error,
            isAuthenticated,
            csrfToken,
            pending2FAUser
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/auth-context.tsx",
        lineNumber: 306,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "yezpXLDoR6SKrYR/fC79b1wn9OE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthProvider;
const useAuth = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/cart-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CartProvider",
    ()=>CartProvider,
    "default",
    ()=>__TURBOPACK__default__export__,
    "useCart",
    ()=>useCart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-context.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const CartContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function CartProvider({ children }) {
    _s();
    const [cartItems, setCartItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [lastUserId, setLastUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Load cart from localStorage on initial render
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            }
        }
    }["CartProvider.useEffect"], []);
    // Clear cart when user logs in (different user)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            if (user && user._id !== lastUserId) {
                // New user logged in, clear the cart
                setCartItems([]);
                localStorage.removeItem('cart');
                setLastUserId(user._id);
            } else if (!user) {
                // User logged out, reset lastUserId
                setLastUserId(null);
            }
        }
    }["CartProvider.useEffect"], [
        user,
        lastUserId
    ]);
    // Save cart to localStorage whenever it changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }
    }["CartProvider.useEffect"], [
        cartItems
    ]);
    const addToCart = (item)=>{
        setCartItems((prevItems)=>{
            const existingItem = prevItems.find((cartItem)=>cartItem.id === item.id);
            if (existingItem) {
                return prevItems.map((cartItem)=>cartItem.id === item.id ? {
                        ...cartItem,
                        quantity: cartItem.quantity + 1
                    } : cartItem);
            }
            return [
                ...prevItems,
                {
                    ...item,
                    quantity: 1
                }
            ];
        });
    };
    const removeFromCart = (itemId)=>{
        setCartItems((prevItems)=>prevItems.filter((item)=>item.id !== itemId));
    };
    const updateQuantity = (itemId, quantity)=>{
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }
        setCartItems((prevItems)=>prevItems.map((item)=>item.id === itemId ? {
                    ...item,
                    quantity
                } : item));
    };
    const clearCart = ()=>{
        setCartItems([]);
    };
    const getCartTotal = ()=>{
        return cartItems.reduce((total, item)=>total + item.price * item.quantity, 0);
    };
    const getItemCount = ()=>{
        return cartItems.reduce((total, item)=>total + item.quantity, 0);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CartContext.Provider, {
        value: {
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getItemCount
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/cart-context.tsx",
        lineNumber: 105,
        columnNumber: 5
    }, this);
}
_s(CartProvider, "inA09pjqRvzJfzS/yf8KzmYyStk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = CartProvider;
function useCart() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
_s1(useCart, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const __TURBOPACK__default__export__ = CartContext;
var _c;
__turbopack_context__.k.register(_c, "CartProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/backend-auth.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
const API_URL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Check for existing token on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const storedToken = localStorage.getItem('auth_token');
            if (storedToken) {
                setToken(storedToken);
                // Verify token and get user
                fetchUser(storedToken);
            } else {
                setLoading(false);
            }
        }
    }["AuthProvider.useEffect"], []);
    // Add function to clear authentication
    const clearAuth = ()=>{
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
        setLoading(false);
    };
    const fetchUser = async (authToken)=>{
        try {
            const apiUrl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                console.log('Token validation failed, clearing stored token');
                clearAuth();
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            clearAuth();
        } finally{
            setLoading(false);
        }
    };
    const login = async (email, password)=>{
        setLoading(true);
        setError(null);
        try {
            const apiUrl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            console.log('Login response data:', data);
            console.log('User isAdmin:', data.user.isAdmin);
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem('auth_token', data.token);
            // Redirect based on user role
            if (data.user.isAdmin) {
                console.log('Redirecting to admin dashboard...');
                router.push('/admin');
            } else {
                const returnTo = new URLSearchParams(window.location.search).get('returnTo') || '/';
                router.push(returnTo);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally{
            setLoading(false);
        }
    };
    const register = async (email, password, name)=>{
        setLoading(true);
        setError(null);
        try {
            const apiUrl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    name
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem('auth_token', data.token);
            router.push('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally{
            setLoading(false);
        }
    };
    const logout = ()=>{
        clearAuth();
        router.push('/auth');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            token,
            setUser,
            login,
            register,
            logout,
            loading,
            error
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/backend-auth.tsx",
        lineNumber: 161,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "K9EDLSOsqIqBjqRxNLggbmOpfxU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/order-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/order-context.tsx
__turbopack_context__.s([
    "OrderProvider",
    ()=>OrderProvider,
    "useOrder",
    ()=>useOrder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const OrderContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function OrderProvider({ children }) {
    _s();
    const [orders, setOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Load orders from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OrderProvider.useEffect": ()=>{
            const savedOrders = localStorage.getItem('orders');
            if (savedOrders) {
                try {
                    setOrders(JSON.parse(savedOrders));
                } catch (error) {
                    console.error('Failed to parse saved orders', error);
                }
            }
        }
    }["OrderProvider.useEffect"], []);
    // Save orders to localStorage whenever they change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OrderProvider.useEffect": ()=>{
            if (orders.length > 0) {
                localStorage.setItem('orders', JSON.stringify(orders));
            }
        }
    }["OrderProvider.useEffect"], [
        orders
    ]);
    const getAllOrders = ()=>{
        return [
            ...orders
        ];
    };
    const addOrder = (order)=>{
        setOrders((prev)=>[
                ...prev,
                order
            ]);
    };
    const updateOrder = (id, updates)=>{
        setOrders((prev)=>prev.map((order)=>order.id === id ? {
                    ...order,
                    ...updates
                } : order));
    };
    const getOrderById = (id)=>{
        return orders.find((order)=>order.id === id);
    };
    const value = {
        orders,
        getAllOrders,
        addOrder,
        updateOrder,
        getOrderById
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OrderContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/order-context.tsx",
        lineNumber: 82,
        columnNumber: 5
    }, this);
}
_s(OrderProvider, "LUO6lFoKZDqEENR4Dk8MEVUG9Os=");
_c = OrderProvider;
function useOrder() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(OrderContext);
    if (context === undefined) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
}
_s1(useOrder, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "OrderProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/contact-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/contact-context.tsx
__turbopack_context__.s([
    "ContactProvider",
    ()=>ContactProvider,
    "useContact",
    ()=>useContact
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const ContactContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function ContactProvider({ children }) {
    _s();
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const submitContact = async (data)=>{
        setIsSubmitting(true);
        try {
            // Replace with your actual API endpoint
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Failed to submit contact form');
            }
            return {
                success: true,
                message: 'Message sent successfully!'
            };
        } catch (error) {
            console.error('Contact form error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to send message'
            };
        } finally{
            setIsSubmitting(false);
        }
    };
    const resetForm = ()=>{
    // Reset form state if needed
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ContactContext.Provider, {
        value: {
            isSubmitting,
            submitContact,
            resetForm
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/contact-context.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
_s(ContactProvider, "oafqrj090+oRf5bsyDQJHsshgoc=");
_c = ContactProvider;
function useContact() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ContactContext);
    if (context === undefined) {
        throw new Error('useContact must be used within a ContactProvider');
    }
    return context;
}
_s1(useContact, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "ContactProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/client-layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ClientLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cart$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/cart-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2d$auth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend-auth.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$order$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/order-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$contact$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/contact-context.tsx [app-client] (ecmascript)");
'use client';
;
;
;
;
;
function ClientLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2d$auth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cart$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$order$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrderProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$contact$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ContactProvider"], {
                    children: children
                }, void 0, false, {
                    fileName: "[project]/app/client-layout.tsx",
                    lineNumber: 18,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/client-layout.tsx",
                lineNumber: 17,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/client-layout.tsx",
            lineNumber: 16,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/client-layout.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = ClientLayout;
var _c;
__turbopack_context__.k.register(_c, "ClientLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
"[project]/node_modules/@vercel/analytics/dist/next/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Analytics",
    ()=>Analytics2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// src/nextjs/index.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// src/nextjs/utils.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
"use client";
;
;
// package.json
var name = "@vercel/analytics";
var version = "1.3.1";
// src/queue.ts
var initQueue = ()=>{
    if (window.va) return;
    window.va = function a(...params) {
        (window.vaq = window.vaq || []).push(params);
    };
};
// src/utils.ts
function isBrowser() {
    return typeof window !== "undefined";
}
function detectEnvironment() {
    try {
        const env = ("TURBOPACK compile-time value", "development");
        if ("TURBOPACK compile-time truthy", 1) {
            return "development";
        }
    } catch (e) {}
    return "production";
}
function setMode(mode = "auto") {
    if (mode === "auto") {
        window.vam = detectEnvironment();
        return;
    }
    window.vam = mode;
}
function getMode() {
    const mode = isBrowser() ? window.vam : detectEnvironment();
    return mode || "production";
}
function isDevelopment() {
    return getMode() === "development";
}
function computeRoute(pathname, pathParams) {
    if (!pathname || !pathParams) {
        return pathname;
    }
    let result = pathname;
    try {
        const entries = Object.entries(pathParams);
        for (const [key, value] of entries){
            if (!Array.isArray(value)) {
                const matcher = turnValueToRegExp(value);
                if (matcher.test(result)) {
                    result = result.replace(matcher, `/[${key}]`);
                }
            }
        }
        for (const [key, value] of entries){
            if (Array.isArray(value)) {
                const matcher = turnValueToRegExp(value.join("/"));
                if (matcher.test(result)) {
                    result = result.replace(matcher, `/[...${key}]`);
                }
            }
        }
        return result;
    } catch (e) {
        return pathname;
    }
}
function turnValueToRegExp(value) {
    return new RegExp(`/${escapeRegExp(value)}(?=[/?#]|$)`);
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
// src/generic.ts
var DEV_SCRIPT_URL = "https://va.vercel-scripts.com/v1/script.debug.js";
var PROD_SCRIPT_URL = "/_vercel/insights/script.js";
function inject(props = {
    debug: true
}) {
    var _a;
    if (!isBrowser()) return;
    setMode(props.mode);
    initQueue();
    if (props.beforeSend) {
        (_a = window.va) == null ? void 0 : _a.call(window, "beforeSend", props.beforeSend);
    }
    const src = props.scriptSrc || (isDevelopment() ? DEV_SCRIPT_URL : PROD_SCRIPT_URL);
    if (document.head.querySelector(`script[src*="${src}"]`)) return;
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.dataset.sdkn = name + (props.framework ? `/${props.framework}` : "");
    script.dataset.sdkv = version;
    if (props.disableAutoTrack) {
        script.dataset.disableAutoTrack = "1";
    }
    if (props.endpoint) {
        script.dataset.endpoint = props.endpoint;
    }
    if (props.dsn) {
        script.dataset.dsn = props.dsn;
    }
    script.onerror = ()=>{
        const errorMessage = isDevelopment() ? "Please check if any ad blockers are enabled and try again." : "Be sure to enable Web Analytics for your project and deploy again. See https://vercel.com/docs/analytics/quickstart for more information.";
        console.log(`[Vercel Web Analytics] Failed to load script from ${src}. ${errorMessage}`);
    };
    if (isDevelopment() && props.debug === false) {
        script.dataset.debug = "false";
    }
    document.head.appendChild(script);
}
function pageview({ route, path }) {
    var _a;
    (_a = window.va) == null ? void 0 : _a.call(window, "pageview", {
        route,
        path
    });
}
// src/react.tsx
function Analytics(props) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Analytics.useEffect": ()=>{
            inject({
                framework: props.framework || "react",
                ...props.route !== void 0 && {
                    disableAutoTrack: true
                },
                ...props
            });
        }
    }["Analytics.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Analytics.useEffect": ()=>{
            if (props.route && props.path) {
                pageview({
                    route: props.route,
                    path: props.path
                });
            }
        }
    }["Analytics.useEffect"], [
        props.route,
        props.path
    ]);
    return null;
}
;
var useRoute = ()=>{
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const finalParams = {
        ...Object.fromEntries(searchParams.entries()),
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- can be empty in pages router
        ...params || {}
    };
    return {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- can be empty in pages router
        route: params ? computeRoute(path, finalParams) : null,
        path
    };
};
// src/nextjs/index.tsx
function AnalyticsComponent(props) {
    const { route, path } = useRoute();
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(Analytics, {
        path,
        route,
        ...props,
        framework: "next"
    });
}
function Analytics2(props) {
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: null
    }, /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(AnalyticsComponent, {
        ...props
    }));
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/node_modules/cookies-next/lib/common/types.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
}),
"[project]/node_modules/cookies-next/node_modules/cookie/dist/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseCookie = parseCookie;
exports.parse = parseCookie;
exports.stringifyCookie = stringifyCookie;
exports.stringifySetCookie = stringifySetCookie;
exports.serialize = stringifySetCookie;
exports.parseSetCookie = parseSetCookie;
exports.stringifySetCookie = stringifySetCookie;
exports.serialize = stringifySetCookie;
/**
 * RegExp to match cookie-name in RFC 6265 sec 4.1.1
 * This refers out to the obsoleted definition of token in RFC 2616 sec 2.2
 * which has been replaced by the token definition in RFC 7230 appendix B.
 *
 * cookie-name       = token
 * token             = 1*tchar
 * tchar             = "!" / "#" / "$" / "%" / "&" / "'" /
 *                     "*" / "+" / "-" / "." / "^" / "_" /
 *                     "`" / "|" / "~" / DIGIT / ALPHA
 *
 * Note: Allowing more characters - https://github.com/jshttp/cookie/issues/191
 * Allow same range as cookie value, except `=`, which delimits end of name.
 */ const cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
/**
 * RegExp to match cookie-value in RFC 6265 sec 4.1.1
 *
 * cookie-value      = *cookie-octet / ( DQUOTE *cookie-octet DQUOTE )
 * cookie-octet      = %x21 / %x23-2B / %x2D-3A / %x3C-5B / %x5D-7E
 *                     ; US-ASCII characters excluding CTLs,
 *                     ; whitespace DQUOTE, comma, semicolon,
 *                     ; and backslash
 *
 * Allowing more characters: https://github.com/jshttp/cookie/issues/191
 * Comma, backslash, and DQUOTE are not part of the parsing algorithm.
 */ const cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
/**
 * RegExp to match domain-value in RFC 6265 sec 4.1.1
 *
 * domain-value      = <subdomain>
 *                     ; defined in [RFC1034], Section 3.5, as
 *                     ; enhanced by [RFC1123], Section 2.1
 * <subdomain>       = <label> | <subdomain> "." <label>
 * <label>           = <let-dig> [ [ <ldh-str> ] <let-dig> ]
 *                     Labels must be 63 characters or less.
 *                     'let-dig' not 'letter' in the first char, per RFC1123
 * <ldh-str>         = <let-dig-hyp> | <let-dig-hyp> <ldh-str>
 * <let-dig-hyp>     = <let-dig> | "-"
 * <let-dig>         = <letter> | <digit>
 * <letter>          = any one of the 52 alphabetic characters A through Z in
 *                     upper case and a through z in lower case
 * <digit>           = any one of the ten digits 0 through 9
 *
 * Keep support for leading dot: https://github.com/jshttp/cookie/issues/173
 *
 * > (Note that a leading %x2E ("."), if present, is ignored even though that
 * character is not permitted, but a trailing %x2E ("."), if present, will
 * cause the user agent to ignore the attribute.)
 */ const domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
/**
 * RegExp to match path-value in RFC 6265 sec 4.1.1
 *
 * path-value        = <any CHAR except CTLs or ";">
 * CHAR              = %x01-7F
 *                     ; defined in RFC 5234 appendix B.1
 */ const pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
/**
 * RegExp to match max-age-value in RFC 6265 sec 5.6.2
 */ const maxAgeRegExp = /^-?\d+$/;
const __toString = Object.prototype.toString;
const NullObject = /* @__PURE__ */ (()=>{
    const C = function() {};
    C.prototype = Object.create(null);
    return C;
})();
/**
 * Parse a `Cookie` header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 */ function parseCookie(str, options) {
    const obj = new NullObject();
    const len = str.length;
    // RFC 6265 sec 4.1.1, RFC 2616 2.2 defines a cookie name consists of one char minimum, plus '='.
    if (len < 2) return obj;
    const dec = options?.decode || decode;
    let index = 0;
    do {
        const eqIdx = eqIndex(str, index, len);
        if (eqIdx === -1) break; // No more cookie pairs.
        const endIdx = endIndex(str, index, len);
        if (eqIdx > endIdx) {
            // backtrack on prior semicolon
            index = str.lastIndexOf(";", eqIdx - 1) + 1;
            continue;
        }
        const key = valueSlice(str, index, eqIdx);
        // only assign once
        if (obj[key] === undefined) {
            obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
        }
        index = endIdx + 1;
    }while (index < len)
    return obj;
}
/**
 * Stringifies an object into an HTTP `Cookie` header.
 */ function stringifyCookie(cookie, options) {
    const enc = options?.encode || encodeURIComponent;
    const cookieStrings = [];
    for (const name of Object.keys(cookie)){
        const val = cookie[name];
        if (val === undefined) continue;
        if (!cookieNameRegExp.test(name)) {
            throw new TypeError(`cookie name is invalid: ${name}`);
        }
        const value = enc(val);
        if (!cookieValueRegExp.test(value)) {
            throw new TypeError(`cookie val is invalid: ${val}`);
        }
        cookieStrings.push(`${name}=${value}`);
    }
    return cookieStrings.join("; ");
}
function stringifySetCookie(_name, _val, _opts) {
    const cookie = typeof _name === "object" ? _name : {
        ..._opts,
        name: _name,
        value: String(_val)
    };
    const options = typeof _val === "object" ? _val : _opts;
    const enc = options?.encode || encodeURIComponent;
    if (!cookieNameRegExp.test(cookie.name)) {
        throw new TypeError(`argument name is invalid: ${cookie.name}`);
    }
    const value = cookie.value ? enc(cookie.value) : "";
    if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${cookie.value}`);
    }
    let str = cookie.name + "=" + value;
    if (cookie.maxAge !== undefined) {
        if (!Number.isInteger(cookie.maxAge)) {
            throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
        }
        str += "; Max-Age=" + cookie.maxAge;
    }
    if (cookie.domain) {
        if (!domainValueRegExp.test(cookie.domain)) {
            throw new TypeError(`option domain is invalid: ${cookie.domain}`);
        }
        str += "; Domain=" + cookie.domain;
    }
    if (cookie.path) {
        if (!pathValueRegExp.test(cookie.path)) {
            throw new TypeError(`option path is invalid: ${cookie.path}`);
        }
        str += "; Path=" + cookie.path;
    }
    if (cookie.expires) {
        if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) {
            throw new TypeError(`option expires is invalid: ${cookie.expires}`);
        }
        str += "; Expires=" + cookie.expires.toUTCString();
    }
    if (cookie.httpOnly) {
        str += "; HttpOnly";
    }
    if (cookie.secure) {
        str += "; Secure";
    }
    if (cookie.partitioned) {
        str += "; Partitioned";
    }
    if (cookie.priority) {
        const priority = typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : undefined;
        switch(priority){
            case "low":
                str += "; Priority=Low";
                break;
            case "medium":
                str += "; Priority=Medium";
                break;
            case "high":
                str += "; Priority=High";
                break;
            default:
                throw new TypeError(`option priority is invalid: ${cookie.priority}`);
        }
    }
    if (cookie.sameSite) {
        const sameSite = typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite;
        switch(sameSite){
            case true:
            case "strict":
                str += "; SameSite=Strict";
                break;
            case "lax":
                str += "; SameSite=Lax";
                break;
            case "none":
                str += "; SameSite=None";
                break;
            default:
                throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
        }
    }
    return str;
}
/**
 * Deserialize a `Set-Cookie` header into an object.
 *
 * deserialize('foo=bar; httpOnly')
 *   => { name: 'foo', value: 'bar', httpOnly: true }
 */ function parseSetCookie(str, options) {
    const dec = options?.decode || decode;
    const len = str.length;
    const endIdx = endIndex(str, 0, len);
    const eqIdx = eqIndex(str, 0, endIdx);
    const setCookie = eqIdx === -1 ? {
        name: "",
        value: dec(valueSlice(str, 0, endIdx))
    } : {
        name: valueSlice(str, 0, eqIdx),
        value: dec(valueSlice(str, eqIdx + 1, endIdx))
    };
    let index = endIdx + 1;
    while(index < len){
        const endIdx = endIndex(str, index, len);
        const eqIdx = eqIndex(str, index, endIdx);
        const attr = eqIdx === -1 ? valueSlice(str, index, endIdx) : valueSlice(str, index, eqIdx);
        const val = eqIdx === -1 ? undefined : valueSlice(str, eqIdx + 1, endIdx);
        switch(attr.toLowerCase()){
            case "httponly":
                setCookie.httpOnly = true;
                break;
            case "secure":
                setCookie.secure = true;
                break;
            case "partitioned":
                setCookie.partitioned = true;
                break;
            case "domain":
                setCookie.domain = val;
                break;
            case "path":
                setCookie.path = val;
                break;
            case "max-age":
                if (val && maxAgeRegExp.test(val)) setCookie.maxAge = Number(val);
                break;
            case "expires":
                if (!val) break;
                const date = new Date(val);
                if (Number.isFinite(date.valueOf())) setCookie.expires = date;
                break;
            case "priority":
                if (!val) break;
                const priority = val.toLowerCase();
                if (priority === "low" || priority === "medium" || priority === "high") {
                    setCookie.priority = priority;
                }
                break;
            case "samesite":
                if (!val) break;
                const sameSite = val.toLowerCase();
                if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
                    setCookie.sameSite = sameSite;
                }
                break;
        }
        index = endIdx + 1;
    }
    return setCookie;
}
/**
 * Find the `;` character between `min` and `len` in str.
 */ function endIndex(str, min, len) {
    const index = str.indexOf(";", min);
    return index === -1 ? len : index;
}
/**
 * Find the `=` character between `min` and `max` in str.
 */ function eqIndex(str, min, max) {
    const index = str.indexOf("=", min);
    return index < max ? index : -1;
}
/**
 * Slice out a value between startPod to max.
 */ function valueSlice(str, min, max) {
    let start = min;
    let end = max;
    do {
        const code = str.charCodeAt(start);
        if (code !== 0x20 /*   */  && code !== 0x09 /* \t */ ) break;
    }while (++start < end)
    while(end > start){
        const code = str.charCodeAt(end - 1);
        if (code !== 0x20 /*   */  && code !== 0x09 /* \t */ ) break;
        end--;
    }
    return str.slice(start, end);
}
/**
 * URL-decode string value. Optimized to skip native call when no %.
 */ function decode(str) {
    if (str.indexOf("%") === -1) return str;
    try {
        return decodeURIComponent(str);
    } catch (e) {
        return str;
    }
}
/**
 * Determine if value is a Date.
 */ function isDate(val) {
    return __toString.call(val) === "[object Date]";
} //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/cookies-next/lib/common/utils.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getRenderPhase = exports.isClientSide = exports.decode = exports.stringify = void 0;
var stringify = function(value) {
    try {
        if (typeof value === 'string') {
            return value;
        }
        var stringifiedValue = JSON.stringify(value);
        return stringifiedValue;
    } catch (e) {
        return value;
    }
};
exports.stringify = stringify;
var decode = function(str) {
    if (!str) return str;
    return str.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
};
exports.decode = decode;
var isClientSide = function(options) {
    return !(options === null || options === void 0 ? void 0 : options.req) && !(options === null || options === void 0 ? void 0 : options.res) && !(options && 'cookies' in options && (options === null || options === void 0 ? void 0 : options.cookies));
};
exports.isClientSide = isClientSide;
var getRenderPhase = function() {
    return typeof window === 'undefined' ? 'server' : 'client';
};
exports.getRenderPhase = getRenderPhase;
}),
"[project]/node_modules/cookies-next/lib/client/cookie-functions.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __assign = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__assign || function() {
    __assign = Object.assign || function(t) {
        for(var s, i = 1, n = arguments.length; i < n; i++){
            s = arguments[i];
            for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.revalidateCookies = exports.hasCookie = exports.deleteCookie = exports.setCookie = exports.getCookie = exports.getCookies = void 0;
var cookie_1 = __turbopack_context__.r("[project]/node_modules/cookies-next/node_modules/cookie/dist/index.js [app-client] (ecmascript)");
var utils_1 = __turbopack_context__.r("[project]/node_modules/cookies-next/lib/common/utils.js [app-client] (ecmascript)");
var ensureClientSide = function(options) {
    if (!(0, utils_1.isClientSide)(options)) {
        throw new Error('You are trying to access cookies on the server side. Please, use the server-side import with `cookies-next/server` instead.');
    }
};
var getCookies = function(_options) {
    ensureClientSide(_options);
    if ((0, utils_1.getRenderPhase)() === 'server') {
        return;
    }
    var cookies = {};
    var documentCookies = document.cookie ? document.cookie.split('; ') : [];
    for(var i = 0, len = documentCookies.length; i < len; i++){
        var cookieParts = documentCookies[i].split('=');
        var cookie = cookieParts.slice(1).join('=');
        var name_1 = cookieParts[0];
        cookies[name_1] = cookie;
    }
    return cookies;
};
exports.getCookies = getCookies;
var getCookie = function(key, options) {
    ensureClientSide(options);
    var _cookies = getCookies(options);
    var value = _cookies === null || _cookies === void 0 ? void 0 : _cookies[key];
    if (value === undefined) return undefined;
    return (0, utils_1.decode)(value);
};
exports.getCookie = getCookie;
var setCookie = function(key, data, options) {
    ensureClientSide(options);
    if ((0, utils_1.getRenderPhase)() === 'server') {
        return;
    }
    var _cookieOptions = options || {};
    var cookieStr = (0, cookie_1.serialize)(key, (0, utils_1.stringify)(data), __assign({
        path: '/'
    }, _cookieOptions));
    document.cookie = cookieStr;
};
exports.setCookie = setCookie;
var deleteCookie = function(key, options) {
    ensureClientSide(options);
    setCookie(key, '', __assign(__assign({}, options), {
        maxAge: -1
    }));
};
exports.deleteCookie = deleteCookie;
var hasCookie = function(key, options) {
    ensureClientSide(options);
    if (!key) return false;
    var cookies = getCookies(options);
    if (!cookies) {
        return false;
    }
    return Object.prototype.hasOwnProperty.call(cookies, key);
};
exports.hasCookie = hasCookie;
var revalidateCookies = function(onChange, previousCookies) {
    ensureClientSide();
    if ((0, utils_1.getRenderPhase)() === 'server') {
        return;
    }
    var currentCookies = getCookies();
    var hasChanged = Object.keys(__assign(__assign({}, currentCookies), previousCookies)).some(function(key) {
        return (currentCookies === null || currentCookies === void 0 ? void 0 : currentCookies[key]) !== (previousCookies === null || previousCookies === void 0 ? void 0 : previousCookies[key]);
    });
    if (hasChanged) {
        onChange(currentCookies);
        previousCookies = currentCookies;
    }
};
exports.revalidateCookies = revalidateCookies;
}),
"[project]/node_modules/cookies-next/lib/client/context.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __assign = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__assign || function() {
    __assign = Object.assign || function(t) {
        for(var s, i = 1, n = arguments.length; i < n; i++){
            s = arguments[i];
            for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CookieProvider = exports.CookieContext = void 0;
var react_1 = __importStar(__turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
var _1 = __turbopack_context__.r("[project]/node_modules/cookies-next/lib/client/index.js [app-client] (ecmascript)");
var utils_1 = __turbopack_context__.r("[project]/node_modules/cookies-next/lib/common/utils.js [app-client] (ecmascript)");
exports.CookieContext = (0, react_1.createContext)(null);
function CookieProvider(_a) {
    var children = _a.children, pollingOptions = _a.pollingOptions;
    var _b = (0, react_1.useState)({}), cookies = _b[0], setCookies = _b[1];
    (0, react_1.useEffect)(function() {
        var initialCookies = (0, _1.getCookies)();
        if (!initialCookies) {
            return;
        }
        setCookies(initialCookies);
    }, []);
    (0, _1.useCookiesPolling)(function(newCookies) {
        if (newCookies) {
            setCookies(newCookies);
        }
    }, pollingOptions);
    var value = (0, react_1.useMemo)(function() {
        return {
            cookies: cookies,
            set: function(key, data) {
                setCookies(function(prev) {
                    var _a;
                    return __assign(__assign({}, prev), (_a = {}, _a[key] = encodeURIComponent((0, utils_1.stringify)(data)), _a));
                });
            },
            get: function(key) {
                var cookieValue = cookies === null || cookies === void 0 ? void 0 : cookies[key];
                return cookieValue;
            },
            getAll: function() {
                return cookies;
            },
            has: function(key) {
                return cookies.hasOwnProperty(key);
            },
            delete: function(key) {
                if (!cookies.hasOwnProperty(key)) {
                    return;
                }
                setCookies(function(prev) {
                    var newCookies = __assign({}, prev);
                    delete newCookies[key];
                    return newCookies;
                });
            },
            revalidateCookiesState: function() {
                (0, _1.revalidateCookies)(function(newCookies) {
                    if (!newCookies) {
                        return;
                    }
                    setCookies(newCookies);
                }, cookies);
            }
        };
    }, [
        cookies
    ]);
    return react_1.default.createElement(exports.CookieContext.Provider, {
        value: value
    }, children);
}
exports.CookieProvider = CookieProvider;
}),
"[project]/node_modules/cookies-next/lib/client/hooks.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.useRevalidateCookiesState = exports.useReactiveHasCookie = exports.useReactiveDeleteCookie = exports.useReactiveSetCookie = exports.useReactiveGetCookie = exports.useReactiveGetCookies = exports.useReactiveCookiesNext = exports.useCookiesNext = exports.useHasCookie = exports.useDeleteCookie = exports.useSetCookie = exports.useGetCookie = exports.useGetCookies = exports.useCookiesPolling = void 0;
var context_1 = __turbopack_context__.r("[project]/node_modules/cookies-next/lib/client/context.js [app-client] (ecmascript)");
var react_1 = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var cookie_functions_1 = __turbopack_context__.r("[project]/node_modules/cookies-next/lib/client/cookie-functions.js [app-client] (ecmascript)");
var useWrappedCookieFn = function(cookieFnCb) {
    var _a = (0, react_1.useState)(false), isMounted = _a[0], setIsMounted = _a[1];
    (0, react_1.useEffect)(function() {
        setIsMounted(true);
    }, []);
    return isMounted ? cookieFnCb : function() {};
};
var useCookieContext = function() {
    var context = (0, react_1.useContext)(context_1.CookieContext);
    if (!context) {
        throw new Error('useCookieContext must be used within a CookieProvider');
    }
    return context;
};
var useCookiesPolling = function(onChange, pollingOptions) {
    var _a = pollingOptions || {}, _b = _a.intervalMs, intervalMs = _b === void 0 ? 1000 : _b, _c = _a.enabled, enabled = _c === void 0 ? false : _c;
    (0, react_1.useEffect)(function() {
        if (!enabled) {
            return;
        }
        var previousCookies = (0, cookie_functions_1.getCookies)();
        var interval = setInterval(function() {
            (0, cookie_functions_1.revalidateCookies)(onChange, previousCookies);
        }, intervalMs);
        return function() {
            return clearInterval(interval);
        };
    }, [
        onChange,
        intervalMs
    ]);
};
exports.useCookiesPolling = useCookiesPolling;
var useGetCookies = function() {
    return useWrappedCookieFn(cookie_functions_1.getCookies);
};
exports.useGetCookies = useGetCookies;
var useGetCookie = function() {
    return useWrappedCookieFn(cookie_functions_1.getCookie);
};
exports.useGetCookie = useGetCookie;
var useHasCookie = function() {
    return useWrappedCookieFn(cookie_functions_1.hasCookie);
};
exports.useHasCookie = useHasCookie;
var useSetCookie = function() {
    return useWrappedCookieFn(cookie_functions_1.setCookie);
};
exports.useSetCookie = useSetCookie;
var useDeleteCookie = function() {
    return useWrappedCookieFn(cookie_functions_1.deleteCookie);
};
exports.useDeleteCookie = useDeleteCookie;
var useCookiesNext = function() {
    return {
        getCookies: useGetCookies(),
        getCookie: useGetCookie(),
        hasCookie: useHasCookie(),
        setCookie: useSetCookie(),
        deleteCookie: useDeleteCookie()
    };
};
exports.useCookiesNext = useCookiesNext;
var useReactiveGetCookies = function() {
    var context = useCookieContext();
    return function() {
        return context === null || context === void 0 ? void 0 : context.getAll();
    };
};
exports.useReactiveGetCookies = useReactiveGetCookies;
var useReactiveGetCookie = function() {
    var context = useCookieContext();
    return function(key) {
        return context === null || context === void 0 ? void 0 : context.get(key);
    };
};
exports.useReactiveGetCookie = useReactiveGetCookie;
var useReactiveSetCookie = function() {
    var context = useCookieContext();
    return function(key, data, options) {
        context === null || context === void 0 ? void 0 : context.set(key, data);
        return (0, cookie_functions_1.setCookie)(key, data, options);
    };
};
exports.useReactiveSetCookie = useReactiveSetCookie;
var useReactiveDeleteCookie = function() {
    var context = useCookieContext();
    return function(key, options) {
        context === null || context === void 0 ? void 0 : context.delete(key);
        return (0, cookie_functions_1.deleteCookie)(key, options);
    };
};
exports.useReactiveDeleteCookie = useReactiveDeleteCookie;
var useReactiveHasCookie = function() {
    var context = useCookieContext();
    return function(key) {
        return context === null || context === void 0 ? void 0 : context.has(key);
    };
};
exports.useReactiveHasCookie = useReactiveHasCookie;
var useRevalidateCookiesState = function() {
    var context = useCookieContext();
    return function() {
        context === null || context === void 0 ? void 0 : context.revalidateCookiesState();
    };
};
exports.useRevalidateCookiesState = useRevalidateCookiesState;
var useReactiveCookiesNext = function() {
    return {
        getCookies: useReactiveGetCookies(),
        getCookie: useReactiveGetCookie(),
        hasCookie: useReactiveHasCookie(),
        setCookie: useReactiveSetCookie(),
        deleteCookie: useReactiveDeleteCookie(),
        revalidateCookiesState: useRevalidateCookiesState()
    };
};
exports.useReactiveCookiesNext = useReactiveCookiesNext;
}),
"[project]/node_modules/cookies-next/lib/client/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CookiesNextProvider = void 0;
__exportStar(__turbopack_context__.r("[project]/node_modules/cookies-next/lib/common/types.js [app-client] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/node_modules/cookies-next/lib/client/cookie-functions.js [app-client] (ecmascript)"), exports);
var context_1 = __turbopack_context__.r("[project]/node_modules/cookies-next/lib/client/context.js [app-client] (ecmascript)");
Object.defineProperty(exports, "CookiesNextProvider", {
    enumerable: true,
    get: function() {
        return context_1.CookieProvider;
    }
});
__exportStar(__turbopack_context__.r("[project]/node_modules/cookies-next/lib/client/hooks.js [app-client] (ecmascript)"), exports);
}),
"[project]/node_modules/cookies-next/lib/server/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __assign = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__assign || function() {
    __assign = Object.assign || function(t) {
        for(var s, i = 1, n = arguments.length; i < n; i++){
            s = arguments[i];
            for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
var __awaiter = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__generator || function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g;
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    //TURBOPACK unreachable
    ;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
var __rest = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__rest || function(s, e) {
    var t = {};
    for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for(var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++){
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hasCookie = exports.deleteCookie = exports.setCookie = exports.getCookie = exports.getCookies = void 0;
var cookie_1 = __turbopack_context__.r("[project]/node_modules/cookies-next/node_modules/cookie/dist/index.js [app-client] (ecmascript)");
var utils_1 = __turbopack_context__.r("[project]/node_modules/cookies-next/lib/common/utils.js [app-client] (ecmascript)");
var ensureServerSide = function(context) {
    if ((0, utils_1.isClientSide)(context)) {
        throw new Error('You are trying to access cookies on the client side. Please, use the client-side import with `cookies-next/client` instead.');
    }
};
var isCookiesFromNext = function(cookieStore) {
    if (!cookieStore) return false;
    return 'getAll' in cookieStore && 'set' in cookieStore && typeof cookieStore.getAll === 'function' && typeof cookieStore.set === 'function';
};
var isContextFromNext = function(context) {
    return !!(context === null || context === void 0 ? void 0 : context.req) && 'cookies' in context.req && isCookiesFromNext(context.req.cookies) || !!(context === null || context === void 0 ? void 0 : context.res) && 'cookies' in context.res && isCookiesFromNext(context.res.cookies) || !!context && 'cookies' in context && typeof context.cookies === 'function';
};
var transformAppRouterCookies = function(cookies) {
    var _cookies = {};
    cookies.getAll().forEach(function(_a) {
        var name = _a.name, value = _a.value;
        _cookies[name] = value;
    });
    return _cookies;
};
var getCookies = function(options) {
    return __awaiter(void 0, void 0, void 0, function() {
        var _a, httpRequest;
        return __generator(this, function(_b) {
            switch(_b.label){
                case 0:
                    ensureServerSide(options);
                    if (!isContextFromNext(options)) return [
                        3 /*break*/ ,
                        2
                    ];
                    if (options.req) {
                        return [
                            2 /*return*/ ,
                            transformAppRouterCookies(options.req.cookies)
                        ];
                    }
                    if (options.res) {
                        return [
                            2 /*return*/ ,
                            transformAppRouterCookies(options.res.cookies)
                        ];
                    }
                    if (!options.cookies) return [
                        3 /*break*/ ,
                        2
                    ];
                    _a = transformAppRouterCookies;
                    return [
                        4 /*yield*/ ,
                        options.cookies()
                    ];
                case 1:
                    return [
                        2 /*return*/ ,
                        _a.apply(void 0, [
                            _b.sent()
                        ])
                    ];
                case 2:
                    if (options === null || options === void 0 ? void 0 : options.req) {
                        httpRequest = options.req;
                    }
                    if (httpRequest === null || httpRequest === void 0 ? void 0 : httpRequest.cookies) {
                        return [
                            2 /*return*/ ,
                            httpRequest.cookies
                        ];
                    }
                    if (httpRequest === null || httpRequest === void 0 ? void 0 : httpRequest.headers.cookie) {
                        return [
                            2 /*return*/ ,
                            (0, cookie_1.parse)(httpRequest.headers.cookie)
                        ];
                    }
                    return [
                        2 /*return*/ ,
                        {}
                    ];
            }
        });
    });
};
exports.getCookies = getCookies;
var getCookie = function(key, options) {
    return __awaiter(void 0, void 0, void 0, function() {
        var cookies, value;
        return __generator(this, function(_a) {
            switch(_a.label){
                case 0:
                    ensureServerSide(options);
                    return [
                        4 /*yield*/ ,
                        getCookies(options)
                    ];
                case 1:
                    cookies = _a.sent();
                    value = cookies[key];
                    if (value === undefined) return [
                        2 /*return*/ ,
                        undefined
                    ];
                    return [
                        2 /*return*/ ,
                        (0, utils_1.decode)(value)
                    ];
            }
        });
    });
};
exports.getCookie = getCookie;
var setCookie = function(key, data, options) {
    return __awaiter(void 0, void 0, void 0, function() {
        var req_1, res_1, cookiesFn, restOptions, payload, cookieOptions, req, res, _a, _req, _res, rest, cookieStore, currentCookies, cookies, cookies;
        return __generator(this, function(_b) {
            switch(_b.label){
                case 0:
                    ensureServerSide(options);
                    if (!isContextFromNext(options)) return [
                        3 /*break*/ ,
                        3
                    ];
                    req_1 = options.req, res_1 = options.res, cookiesFn = options.cookies, restOptions = __rest(options, [
                        "req",
                        "res",
                        "cookies"
                    ]);
                    payload = __assign({
                        name: key,
                        value: (0, utils_1.stringify)(data)
                    }, restOptions);
                    if (req_1) {
                        req_1.cookies.set(payload);
                    }
                    if (res_1) {
                        res_1.cookies.set(payload);
                    }
                    if (!cookiesFn) return [
                        3 /*break*/ ,
                        2
                    ];
                    return [
                        4 /*yield*/ ,
                        cookiesFn()
                    ];
                case 1:
                    _b.sent().set(payload);
                    _b.label = 2;
                case 2:
                    return [
                        2 /*return*/ 
                    ];
                case 3:
                    cookieOptions = {};
                    if (options) {
                        _a = options, _req = _a.req, _res = _a.res, rest = __rest(_a, [
                            "req",
                            "res"
                        ]);
                        req = _req;
                        res = _res;
                        cookieOptions = rest;
                    }
                    cookieStore = (0, cookie_1.serialize)(key, (0, utils_1.stringify)(data), __assign({
                        path: '/'
                    }, cookieOptions));
                    if (res && req) {
                        currentCookies = res.getHeader('Set-Cookie');
                        if (!Array.isArray(currentCookies)) {
                            currentCookies = !currentCookies ? [] : [
                                String(currentCookies)
                            ];
                        }
                        res.setHeader('Set-Cookie', currentCookies.concat(cookieStore));
                        if (req && req.cookies) {
                            cookies = req.cookies;
                            data === '' ? delete cookies[key] : cookies[key] = (0, utils_1.stringify)(data);
                        }
                        if (req && req.headers && req.headers.cookie) {
                            cookies = (0, cookie_1.parse)(req.headers.cookie);
                            data === '' ? delete cookies[key] : cookies[key] = (0, utils_1.stringify)(data);
                            req.headers.cookie = Object.entries(cookies).reduce(function(accum, item) {
                                return accum.concat("".concat(item[0], "=").concat(item[1], ";"));
                            }, '');
                        }
                    }
                    return [
                        2 /*return*/ 
                    ];
            }
        });
    });
};
exports.setCookie = setCookie;
var deleteCookie = function(key, options) {
    return __awaiter(void 0, void 0, void 0, function() {
        return __generator(this, function(_a) {
            ensureServerSide(options);
            return [
                2 /*return*/ ,
                setCookie(key, '', __assign(__assign({}, options), {
                    maxAge: -1
                }))
            ];
        });
    });
};
exports.deleteCookie = deleteCookie;
var hasCookie = function(key, options) {
    return __awaiter(void 0, void 0, void 0, function() {
        var cookie;
        return __generator(this, function(_a) {
            switch(_a.label){
                case 0:
                    ensureServerSide(options);
                    if (!key) return [
                        2 /*return*/ ,
                        false
                    ];
                    return [
                        4 /*yield*/ ,
                        getCookies(options)
                    ];
                case 1:
                    cookie = _a.sent();
                    return [
                        2 /*return*/ ,
                        cookie.hasOwnProperty(key)
                    ];
            }
        });
    });
};
exports.hasCookie = hasCookie;
__exportStar(__turbopack_context__.r("[project]/node_modules/cookies-next/lib/common/types.js [app-client] (ecmascript)"), exports);
}),
"[project]/node_modules/cookies-next/lib/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CookiesNextProvider = exports.useReactiveCookiesNext = exports.useReactiveHasCookie = exports.useReactiveDeleteCookie = exports.useReactiveSetCookie = exports.useReactiveGetCookie = exports.useReactiveGetCookies = exports.useCookiesNext = exports.useDeleteCookie = exports.useGetCookie = exports.useSetCookie = exports.useHasCookie = exports.useGetCookies = exports.hasCookie = exports.deleteCookie = exports.setCookie = exports.getCookie = exports.getCookies = void 0;
var clientCookies = __importStar(__turbopack_context__.r("[project]/node_modules/cookies-next/lib/client/index.js [app-client] (ecmascript)"));
var serverCookies = __importStar(__turbopack_context__.r("[project]/node_modules/cookies-next/lib/server/index.js [app-client] (ecmascript)"));
__exportStar(__turbopack_context__.r("[project]/node_modules/cookies-next/lib/common/types.js [app-client] (ecmascript)"), exports);
var utils_1 = __turbopack_context__.r("[project]/node_modules/cookies-next/lib/common/utils.js [app-client] (ecmascript)");
var getCookies = function(options) {
    return (0, utils_1.isClientSide)(options) ? clientCookies.getCookies(options) : serverCookies.getCookies(options);
};
exports.getCookies = getCookies;
var getCookie = function(key, options) {
    return (0, utils_1.isClientSide)(options) ? clientCookies.getCookie(key, options) : serverCookies.getCookie(key, options);
};
exports.getCookie = getCookie;
var setCookie = function(key, data, options) {
    return (0, utils_1.isClientSide)(options) ? clientCookies.setCookie(key, data, options) : serverCookies.setCookie(key, data, options);
};
exports.setCookie = setCookie;
var deleteCookie = function(key, options) {
    return (0, utils_1.isClientSide)(options) ? clientCookies.deleteCookie(key, options) : serverCookies.deleteCookie(key, options);
};
exports.deleteCookie = deleteCookie;
var hasCookie = function(key, options) {
    return (0, utils_1.isClientSide)(options) ? clientCookies.hasCookie(key, options) : serverCookies.hasCookie(key, options);
};
exports.hasCookie = hasCookie;
var client_1 = __turbopack_context__.r("[project]/node_modules/cookies-next/lib/client/index.js [app-client] (ecmascript)");
Object.defineProperty(exports, "useGetCookies", {
    enumerable: true,
    get: function() {
        return client_1.useGetCookies;
    }
});
Object.defineProperty(exports, "useHasCookie", {
    enumerable: true,
    get: function() {
        return client_1.useHasCookie;
    }
});
Object.defineProperty(exports, "useSetCookie", {
    enumerable: true,
    get: function() {
        return client_1.useSetCookie;
    }
});
Object.defineProperty(exports, "useGetCookie", {
    enumerable: true,
    get: function() {
        return client_1.useGetCookie;
    }
});
Object.defineProperty(exports, "useDeleteCookie", {
    enumerable: true,
    get: function() {
        return client_1.useDeleteCookie;
    }
});
Object.defineProperty(exports, "useCookiesNext", {
    enumerable: true,
    get: function() {
        return client_1.useCookiesNext;
    }
});
Object.defineProperty(exports, "useReactiveGetCookies", {
    enumerable: true,
    get: function() {
        return client_1.useReactiveGetCookies;
    }
});
Object.defineProperty(exports, "useReactiveGetCookie", {
    enumerable: true,
    get: function() {
        return client_1.useReactiveGetCookie;
    }
});
Object.defineProperty(exports, "useReactiveSetCookie", {
    enumerable: true,
    get: function() {
        return client_1.useReactiveSetCookie;
    }
});
Object.defineProperty(exports, "useReactiveDeleteCookie", {
    enumerable: true,
    get: function() {
        return client_1.useReactiveDeleteCookie;
    }
});
Object.defineProperty(exports, "useReactiveHasCookie", {
    enumerable: true,
    get: function() {
        return client_1.useReactiveHasCookie;
    }
});
Object.defineProperty(exports, "useReactiveCookiesNext", {
    enumerable: true,
    get: function() {
        return client_1.useReactiveCookiesNext;
    }
});
Object.defineProperty(exports, "CookiesNextProvider", {
    enumerable: true,
    get: function() {
        return client_1.CookiesNextProvider;
    }
});
}),
]);

//# sourceMappingURL=_192c88d2._.js.map