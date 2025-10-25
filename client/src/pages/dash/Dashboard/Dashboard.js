import s from "./Dashboard.module.css";
import DashboardLayout from '../../../components/DashboardLayout';
import { useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import Button from "../../../components/Button";

export default function Dashboard() {
    const [layout, setLayout] = useState([
        { i: "pomodoro", x: 0, y: 0, w: 3, h: 2 }, // temporary
        { i: "goal", x: 3, y: 0, w: 3, h: 2 },
    ]);

    const handleLayoutChange = (newLayout) => {
        setLayout(newLayout);
        localStorage.setItem("dashboardLayout", JSON.stringify(newLayout));
    };


    return (
        <div className={s.dashboardContainer}>
            <section className={s.mainSection}>
                <div className={s.overviewSection}>
                    {/* insert overview components here */}
                    <Button variant="primary">Add New</Button>
                </div>

                <div className={s.addButtonSection}> {/* or just put button here */}

                </div>
            </section>

            <section className={s.widgetsSection}>
                <h2>Widgets</h2>
                <GridLayout
                    className="layout"
                    layout={layout}
                    cols={6}
                    rowHeight={120}
                    width={600}
                    onLayoutChange={handleLayoutChange}
                >

                </GridLayout>
            </section>
        </div>
    );
}
