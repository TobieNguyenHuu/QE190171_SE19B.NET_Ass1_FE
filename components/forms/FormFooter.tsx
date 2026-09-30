import { btnPrimary, btnSecondary } from "@/components/ui/styles";
import { Spinner } from "@/components/ui/Spinner";

export function FormFooter({ saving, isEdit, onCancel }: { saving: boolean; isEdit: boolean; onCancel: () => void }) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <button type="button" className={btnSecondary} onClick={onCancel} disabled={saving}>Cancel</button>
      <button type="submit" className={btnPrimary} disabled={saving}>
        {saving && <Spinner className="h-4 w-4 text-white" />}
        {isEdit ? "Save changes" : "Create"}
      </button>
    </div>
  );
}
