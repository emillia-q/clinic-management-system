import './App.css'
import {Header} from "./components/layout/Header.tsx";
import {AdminDashboard} from "./pages/AdminDashboard/AdminDashboard.tsx";
import {PatientsPage} from "./pages/ReceptionistDashboard/PatientsPage.tsx";
import {useState} from "react";

function App() {
    const [role] = useState<'ADMIN' | 'RECEPTIONIST'>('RECEPTIONIST');
    const handleLogout = () => {
        console.log("User logged out");
    };

    return (
        <div className="App">
            <Header
                userRole={role}
                onLogout={handleLogout}
            />

            <main>
                {role === 'ADMIN' ? (
                    <AdminDashboard/>
                ) : (
                    <PatientsPage/>
                )}
            </main>
        </div>
    );
}

export default App;