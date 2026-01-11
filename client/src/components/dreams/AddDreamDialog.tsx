import React, { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import DreamForm from "./DreamForm";

interface AddDreamDialogProps {
  onSave: (entry: Partial<import("../../types/DreamEntry").DreamEntry>) => Promise<any>;
  buttonLabel?: string;
}

const AddDreamDialog: React.FC<AddDreamDialogProps> = ({
  onSave,
  buttonLabel = "+ Add new dream",
}) => {
  const [open, setOpen] = useState(false);

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={openDialog}
        className="add-entry-button"
        disableElevation
      >
        {buttonLabel}
      </Button>

      <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>Add new dream entry</DialogTitle>
        <DialogContent>
          <DreamForm onSubmit={onSave} onClose={closeDialog} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddDreamDialog;
