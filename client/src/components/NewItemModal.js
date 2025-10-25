import s from "./NewItemModal.module.css";
import { useState, useRef, useEffect } from "react";

import Button from "./Button"

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
    const modalRef = useRef(null);
    const savedForm = useRef(formData);

    //detect clicks outside modal, close if so
    useEffect(() => {
        const handleClickOutside = (e) =>{
            if(modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };

        if(isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        };

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    //detects ESC key, closes modal
    useEffect(() => {
        const handleEsc = (e) => {
            if(e.key === "Escape") onClose();
        };
        if(isOpen) {
            document.addEventListener("keydown", handleEsc);
        };
        return () => document.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
    if (isOpen) {
        setFormData(savedForm.current);
    } else {
        savedForm.current = formData;
    }
}, [isOpen]);


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
        savedForm.current = formData;
        onClose();
    };

    if (!isOpen) return null;
    return (
        <div className={s.modalOverlay}>
            <div className={s.modalContent} ref={modalRef}>
                <Button variant="alert" onClick={onClose}>X</Button>
                <form>
                    <h2>Add New Item to Calendar</h2>
                    <div>
                    </div> {/* type toggle switcher */}

                    <label>Title</label>
                    <input name="title" value={formData.title} onChange={handleChange}/> {/* title */}

                    <label>Notes</label>
                    <input name="notes" value={formData.notes} onChange={handleChange}/> {/* notes */}

                    <label>Category</label>
                    <input name="category" value={formData.category} onChange={handleChange}/> {/* category */}

                    <label>Reminders</label>
                    <input name="reminders" value={formData.reminders} onChange={handleChange}/>{/* reminders */}

                    <label>Repeat</label>
                    <input name="repeat" value={formData.repeat} onChange={handleChange}/> {/* repeat */}

                    <label>Repeat Rules</label>
                    <input name="repeatRules" value={formData.repeatRules} onChange={handleChange}/> {/* repeat rules */}

                    {type === "task" && (
                        <>
                            {/* task specific fields */}
                            <label>Due Date</label>
                            <input name="dueDate" value={formData.dueDate} onChange={handleChange}/> {/* due date */}
                            <label>Complete Status</label>
                            <input name="completeStatus" value={formData.completeStatus} onChange={handleChange}/> {/* complete status */}
                            <label>Link</label>
                            <input name="link" value={formData.link} onChange={handleChange}/> {/* link */}
                        </>
                    )}
                    {type === "event" && (
                        <>
                            {/* event specific fields */}
                            <label>Start Time</label>
                            <input name="startTime" value={formData.startTime} onChange={handleChange}/> {/* start time */}
                            <label>End Time</label>
                            <input name="endTime" value={formData.endTime} onChange={handleChange}/> {/* end time */}
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};
