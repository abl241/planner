import s from "./NewItemModal.module.css";
import { useState, useRef, useEffect } from "react";

import Button from "./Button"

export default function NewItemModal({ isOpen, onClose, onAdd }) {
    const [type, setType] = useState("task"); // "task" or "event"
    const today = new Date();
    const defaultDate = {
        day: String(today.getDate()).padStart(2, "0"),
        month: String(today.getMonth() + 1).padStart(2, "0"),
        year: String(today.getFullYear()),
    };
    const [formData, setFormData] = useState({
        title: "",
        notes: "",
        category: "",
        reminders: "",
        repeat: "",
        repeatRules: "",
        //task specific
        dueDate: {month: defaultDate.month, day: defaultDate.day, year: defaultDate.year, hour: "12", minute: "00", period: "AM"},
        completeStatus: false,
        link: "",
        //event specific
        startTime: {month: defaultDate.month, day: defaultDate.day, year: defaultDate.year, hour: "12", minute: "00", period: "AM"},
        endTime: {month: defaultDate.month, day: defaultDate.day, year: defaultDate.year, hour: "12", minute: "00", period: "AM"},
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

    //Handlers for time or date change
    const [tempDate, setTempDate] = useState(formData);
    useEffect(() => {
        if (isOpen) setTempDate(formData);
    }, [isOpen, formData]);

    const pad = (val) => {
        if (!val) return "";
        let v = String(val).replace(/\D/g, "");
        if (v.length === 1) v = v.padStart(2, "0");
        if (v.length > 2) v = v.slice(-2);
        return v;
    };
    const padYear = (year) => {
        if (!year) return "";
        let y = String(year).replace(/\D/g, "");
        if (y.length <= 2) return `20${y.padStart(2, "0")}`;
        if (y.length === 3) return `1${y}`;
        return y.slice(0, 4);
    };

    function normalizeDate({ day, month, year }) {
        const now = new Date();

        let y = parseInt(year, 10);
        let m = parseInt(month, 10);
        let d = parseInt(day, 10);

        if (isNaN(y)) y = now.getFullYear();
        if (isNaN(m) || m < 1 || m > 12) m = now.getMonth() + 1;
        if (isNaN(d) || d < 1) d = 1;

        const maxDay = new Date(y, m, 0).getDate();
        if (d > maxDay) d = maxDay;
        return {
            year: padYear(y),
            month: pad(m),
            day: pad(d),
        };
    };

    const handleTempChange = (field, part, min, max) => (e) => {
        const val = e.target.value.replace(/\D/g, ""); // only numbers
        if (val === "" || val.length <= (part === "year" ? 4 : 2)) {
            setTempDate((prev) => ({
                ...prev,
                [field]: { ...prev[field], [part]: val },
            }));
        }
    };

    const handlePadBlur = (field, part) => () => {
        setTempDate((prev) => {
            const current = prev[field] || {};
            const prevPart = current[part] ?? "";
            let updated = { ...current };

            if (prevPart !== "") {
                updated[part] = part === "year" ? padYear(prevPart) : pad(prevPart);
            }
            const { day, month, year } = updated;
            if (day && month && year) {
                updated = normalizeDate(updated);
            }

            const newTemp = { ...prev, [field]: updated };
            setFormData(newTemp);
            return newTemp;
        });
    }

    const handleTimeChange = (field, part, min, max) => (e) => {
        const val = e.target.value.replace(/\D/g, "");
        if (val === "" || (Number(val) >= min && Number(val) <= max)) {
            setFormData((prev) => ({
                ...prev,
                [field]: { ...prev[field], [part]: val },
            }));
        }
    };
    const getMaxDay = (month, year) => {
        if (!month) return 31;
        return new Date(year || 2000, month, 0).getDate();
    };
    const handleDateChange = (field, part, min, max) => (e) => {
        let val = e.target.value.replace(/\D/g, "");

        if (val === "") {
            setFormData((prev) => ({
            ...prev,
            [field]: { ...prev[field], [part]: "" },
            }));
            return;
        }

        if (part === "day") {
            const maxDay = getMaxDay(
            Number(formData[field].month),
            Number(formData[field].year)
            );
            max = Math.min(max, maxDay);
        }

        if (Number(val) >= min && Number(val) <= max) {
            setFormData((prev) => ({
            ...prev,
            [field]: { ...prev[field], [part]: val },
            }));
        }
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
                <form autoComplete="off" autoCorrect="off" spellCheck="off">
                    <div className={s.toggleTypeContainer}>
                        <div className={s.toggleGroup}>
                            <h2>Add a New:</h2>
                            <Button onClick={() => setType("task")} className={`${s.toggleButton} ${type === "task" ? s.active : ""}`}>Task</Button>
                            <Button onClick={() => setType("event")} className={`${s.toggleButton} ${type === "event" ? s.active : ""}`}>Event</Button>
                        </div>
                        <Button variant="alert" onClick={onClose} className={s.xButton}>X</Button>
                    </div>

                    <div className={s.titleAndCategory}>
                        <div className={s.titleDiv}>
                            <label>Title</label>
                            <input name="title" value={formData.title} onChange={handleChange}/> {/* title */}
                        </div>
                        <div className={s.categoryDiv}>
                            <label>Category</label>
                            <input name="category" value={formData.category} onChange={handleChange}/> {/* category */}
                        </div>
                    </div>

                    <div className={s.labelInputPair}>
                        <label>Notes</label>
                        <input name="notes" value={formData.notes} onChange={handleChange}/> {/* notes */}
                    </div>

                    {type === "task" && (
                        <>
                            {/* task specific fields */}
                            <div className={s.labelInputPair}>
                                    <label>Due Date</label>
                                    <div>
                                        <input className={`${s.time} ${s.MM}`} name="dueDateMM" value={tempDate.dueDate.month} onChange={handleTempChange("dueDate", "month", 1, 12)} onBlur={handlePadBlur("dueDate", "month")} maxLength={2} inputMode="numeric"/>
                                        /
                                        <input className={`${s.time} ${s.DD}`} name="dueDateDD" value={tempDate.dueDate.day} onChange={handleTempChange("dueDate", "day", 1, 31)} onBlur={handlePadBlur("dueDate", "day")} maxLength={2} inputMode="numeric"/>
                                        /
                                        <input className={`${s.time} ${s.YYYY}`} name="dueDateYYYY" value={tempDate.dueDate.year} onChange={handleTempChange("dueDate", "year", 0, 2100)} onBlur={handlePadBlur("dueDate", "year")} maxLength={4} inputMode="numeric"/>
                                        at
                                        <input className={`${s.time} ${s.Hour}`} name="dueDateHour" value={tempDate.dueDate.hour} onChange={handleTimeChange("dueDate", "hour", 1, 12)} onBlur={handlePadBlur("dueDate", "hour")} maxLength={2} inputMode="numeric"/>
                                        :
                                        <input className={`${s.time} ${s.Minute}`} name="dueDateMinute" value={tempDate.dueDate.minute} onChange={handleTimeChange("dueDate", "minute", 0, 59)} onBlur={handlePadBlur("dueDate", "minute")} maxLength={2} inputMode="numeric"/>
                                    </div>
                                </div>
                            <label>Link</label>
                            <input name="link" value={formData.link} onChange={handleChange}/> {/* link */}
                        </>
                    )}
                    {type === "event" && (
                        <>
                            {/* event specific fields */}
                            <div className={s.startEndTime}>
                                <div className={s.labelInputPair}>
                                    <label>Start Time</label>
                                    <div>
                                        <input className={`${s.time} ${s.MM}`} name="startTimeMM" value={tempDate.startTime.month} onChange={handleTempChange("startTime", "month", 1, 12)} onBlur={handlePadBlur("startTime", "month")} maxLength={2} inputMode="numeric"/>
                                        /
                                        <input className={`${s.time} ${s.DD}`} name="startTimeDD" value={tempDate.startTime.day} onChange={handleTempChange("startTime", "day", 1, 31)} onBlur={handlePadBlur("startTime", "day")} maxLength={2} inputMode="numeric"/>
                                        /
                                        <input className={`${s.time} ${s.YYYY}`} name="startTimeYYYY" value={tempDate.startTime.year} onChange={handleTempChange("startTime", "year", 0, 2100)} onBlur={handlePadBlur("startTime", "year")} maxLength={4} inputMode="numeric"/>
                                        at
                                        <input className={`${s.time} ${s.Hour}`} name="startTimeHour" value={tempDate.startTime.hour} onChange={handleTimeChange("startTime", "hour", 1, 12)} onBlur={handlePadBlur("startTime", "hour")} maxLength={2} inputMode="numeric"/>
                                        :
                                        <input className={`${s.time} ${s.Minute}`} name="startTimeMinute" value={tempDate.startTime.minute} onChange={handleTimeChange("startTime", "minute", 0, 59)} onBlur={handlePadBlur("startTime", "minute")} maxLength={2} inputMode="numeric"/>
                                    </div>
                                </div>
                                <div className={s.labelInputPair}>
                                    <label>End Time</label>
                                    <div>
                                        <input className={`${s.time} ${s.MM}`} name="endTimeMM" value={tempDate.endTime.month} onChange={handleTempChange("endTime", "month", 1, 12)} onBlur={handlePadBlur("endTime", "month")} maxLength={2} inputMode="numeric"/>
                                        /
                                        <input className={`${s.time} ${s.DD}`} name="endTimeDD" value={tempDate.endTime.day} onChange={handleTempChange("endTime", "day", 1, 31)} onBlur={handlePadBlur("endTime", "day")} maxLength={2} inputMode="numeric"/>
                                        /
                                        <input className={`${s.time} ${s.YYYY}`} name="endTimeYYYY" value={tempDate.endTime.year} onChange={handleTempChange("endTime", "year", 0, 2100)} onBlur={handlePadBlur("endTime", "year")} maxLength={4} inputMode="numeric"/>
                                        at
                                        <input className={`${s.time} ${s.Hour}`} name="endTimeHour" value={tempDate.endTime.hour} onChange={handleTimeChange("endTime", "hour", 1, 12)} onBlur={handlePadBlur("endTime", "hour")} maxLength={2} inputMode="numeric"/>
                                        :
                                        <input className={`${s.time} ${s.Minute}`} name="endTimeMinute" value={tempDate.endTime.minute} onChange={handleTimeChange("endTime", "minute", 0, 59)} onBlur={handlePadBlur("endTime", "minute")} maxLength={2} inputMode="numeric"/>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};
