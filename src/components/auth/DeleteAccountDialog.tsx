import { DeleteAccountForm } from "./DeleteAccountForm";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const DeleteAccountDialog = () => {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="destructive">
            Delete Account
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DeleteAccountForm />
      </DialogContent>
    </Dialog>
  );
};