"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Flag, X } from "lucide-react";

export function FakeReportDialog({ onReportSubmit }: { onReportSubmit: (reason: string, comment: string) => void }) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("incomplete");
    const [comment, setComment] = useState("");

    const handleSubmit = () => {
        onReportSubmit(reason, comment);
        setOpen(false);
    };

    if (!open) {
        return (
            <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50" onClick={() => setOpen(true)}>
                <Flag className="mr-2 h-4 w-4" /> Report Issue / Fake Work
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" /> Report Grievance
                    </h3>
                    <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="h-8 w-8">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="p-4 space-y-4">
                    <div className="space-y-3">
                        <Label>Reason for reporting</Label>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <input type="radio" id="fake" name="reason" value="fake" checked={reason === "fake"} onChange={(e) => setReason(e.target.value)} className="accent-red-600" />
                                <Label htmlFor="fake" className="font-normal cursor-pointer">Fake Completion (Work not done)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="radio" id="incomplete" name="reason" value="incomplete" checked={reason === "incomplete"} onChange={(e) => setReason(e.target.value)} className="accent-red-600" />
                                <Label htmlFor="incomplete" className="font-normal cursor-pointer">Incomplete / Poor Quality</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="radio" id="location" name="reason" value="location" checked={reason === "location"} onChange={(e) => setReason(e.target.value)} className="accent-red-600" />
                                <Label htmlFor="location" className="font-normal cursor-pointer">Wrong Location / Proof Mismatch</Label>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Additional Details</Label>
                        <Textarea
                            placeholder="Please describe why you are reporting this..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="bg-slate-50"
                        />
                    </div>
                </div>

                <div className="p-4 bg-slate-50 flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleSubmit}>Submit Report</Button>
                </div>
            </div>
        </div>
    );
}
