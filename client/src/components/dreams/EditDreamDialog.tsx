import React, { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import DreamForm from "./DreamForm";
import type { DreamEntry } from "../../types/DreamEntry";

interface EditDreamDialogProps {
  entry: DreamEntry;
  open?: boolean;
  onClose?: () => void;
  onSave: (id: number, entry: Partial<DreamEntry>) => Promise<any>;
}

const EditDreamDialog: React.FC<EditDreamDialogProps> = ({ entry, open, onClose, onSave }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = typeof open !== "undefined";

  const resolvedOpen = isControlled ? open! : internalOpen;
  const closeDialog = () => {
    if (isControlled) {
      onClose && onClose();
    } else {
      setInternalOpen(false);
    }
  };

  const openDialog = () => {
    if (isControlled) return;
    setInternalOpen(true);
  };

  const handleSave = async (data: Partial<DreamEntry>) => {
    await onSave(entry.id, data);
  };

  return (
    <>
      {!isControlled && (
        <Button variant="text" onClick={openDialog} size="small">
          Edit
        </Button>
      )}

      <Dialog open={resolvedOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>Edit dream entry</DialogTitle>
        <DialogContent>
          <DreamForm initial={entry} onSubmit={handleSave} onClose={closeDialog} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditDreamDialog;
