import s from "./NewItemModal.module.css";
import { useState } from "react";

export default function NewItemModal({ isOpen, onClose, onAdd }) {
    const [type, setType] = useState("task"); // "task" or "event"
    const [formData, setFormData] = useState({
        title: "",
        notes: "",
        category: "",
        reminders: "",
        repeat: "",
        repeatRules: "",
        //task specific
        dueDate: "",
        completeStatus: false,
        link: "",
        //event specific
        startTime: "",
        endTime: "",
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        setFormData({
            title: "",
            notes: "",
            date: "",
            category: "",
            reminders: "",
            repeat: "",
            repeatRules: "",
            completeStatus: false,
            link: "",
            startTime: "",
            endTime: "",
        });
        onClose();
    };

    return (
        <div className={s.modalOverlay}>
            <div className={s.modalContent}>
                <button className={s.closeButton} onClick={onClose}>X</button>
                <form>
                    <h2>Add New Item to Calendar</h2>
                    <div>
                    </div> {/* type toggle switcher */}

                    <label>Title</label>
                    <input>
                    </input> {/* title */}

                    <label>Notes</label>
                    <input>
                    </input> {/* notes */}

                    <label>Category</label>
                    <input>
                    </input> {/* category */}

                    <label>Reminders</label>
                    <input>
                    </input> {/* reminders */}

                    <label>Repeat</label>
                    <input>
                    </input> {/* repeat */}

                    <label>Repeat Rules</label>
                    <input>
                    </input> {/* repeat rules */}

                    {type === "task" && (
                        <>
                            {/* task specific fields */}
                            <label>Due Date</label>
                            <input>
                            </input> {/* due date */}
                            <label>Complete Status</label>
                            <input>
                            </input> {/* complete status */}
                            <label>Link</label>
                            <input>
                            </input> {/* link */}
                        </>
                    )}
                    {type === "event" && (
                        <>
                            {/* event specific fields */}
                            <label>Start Time</label>
                            <input>
                            </input> {/* start time */}
                            <label>End Time</label>
                            <input>
                            </input> {/* end time */}
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};
