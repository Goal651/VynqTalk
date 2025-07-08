import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Message } from "@/types";

interface MessageDialogsProps {
  messageToDelete: number | null;
  messageToEdit: Message | null;
  editedContent: string;
  setEditedContent: (content: string) => void;
  setMessageToDelete: (id: number | null) => void;
  setMessageToEdit: (message: Message | null) => void;
  confirmDeleteMessage: () => void;
  confirmEditMessage: () => void;
}

export const MessageDialogs = ({
  messageToDelete,
  messageToEdit,
  editedContent,
  setEditedContent,
  setMessageToDelete,
  setMessageToEdit,
  confirmDeleteMessage,
  confirmEditMessage
}: MessageDialogsProps) => {
  return (
    <>
      <AlertDialog open={messageToDelete !== null} onOpenChange={(open) => !open && setMessageToDelete(null)}>
        <AlertDialogContent className="bg-background border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              console.log("Delete cancelled");
              setMessageToDelete(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteMessage}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={messageToEdit !== null} onOpenChange={(open) => !open && setMessageToEdit(null)}>
        <DialogContent className="bg-background border border-border">
          <DialogHeader>
            <DialogTitle>Edit message</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editedContent}
            onChange={(e) => {
              console.log("Edit content changed:", e.target.value);
              setEditedContent(e.target.value);
            }}
            className="min-h-[100px] bg-background/50 border-border/50 focus:border-primary/50"
            placeholder="Edit your message..."
          />
          <DialogFooter>
            <Button type="button"
              variant="outline"
              onClick={() => {
                console.log("Edit cancelled");
                setMessageToEdit(null);
              }}
            >
              Cancel
            </Button>
            <Button type="button"
              onClick={confirmEditMessage}
              disabled={!editedContent.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
