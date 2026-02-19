import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { type FolderFormData,folderSchema } from "@/features/folder/validation/folder-schema";

export function useFolderForm(defaultName = "") {
	return useForm<FolderFormData>({
		resolver: zodResolver(folderSchema),
		values: { name: defaultName },
		defaultValues: { name: defaultName },
		mode: "onChange",
	});
}
