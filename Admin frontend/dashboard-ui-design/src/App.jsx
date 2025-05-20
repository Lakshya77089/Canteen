import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/contexts/theme-context";

import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import FoodItem from "./routes/FoodItem/page";
import PendingOrders from "./routes/PendingOrders/page";
import ConfirmOrders from "./routes/ConfirmOrders/page";
import DeliveredOrders from "./routes/DeliveredOrders/page";
import Login from "./routes/login";
import ProtectedRoute from "./protected/ProtectedRoute";
function App() {
    const router = createBrowserRouter([
        {
            path:"/login",
            element:<Login/>
        },
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    index: true,
                    element: <ProtectedRoute element={<DashboardPage />} />,
                },
                {
                    path: "FoodItem",
                    element:<ProtectedRoute element={<FoodItem />} />,
                },
                {
                    path: "PendingOrders",
                    element: <ProtectedRoute element={<PendingOrders />} />,
                },
                {
                    path: "ConfirmOrders",
                    element: <ProtectedRoute element={<ConfirmOrders />} />,
                },
                {
                    path: "DeliveredOrders",
                    element: <ProtectedRoute element={<DeliveredOrders />} />,
                },
                {
                    path: "new-customer",
                    element: <h1 className="title">New Customer</h1>,
                },
                {
                    path: "verified-customers",
                    element: <h1 className="title">Verified Customers</h1>,
                },
                {
                    path: "products",
                    element: <h1 className="title">Products</h1>,
                },
                {
                    path: "new-product",
                    element: <h1 className="title">New Product</h1>,
                },
                {
                    path: "inventory",
                    element: <h1 className="title">Inventory</h1>,
                },
                {
                    path: "settings",
                    element: <h1 className="title">Settings</h1>,
                },
            ],
        },
    ]);

    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
