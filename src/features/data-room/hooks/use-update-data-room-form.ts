import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { type CreateDataRoomFormData, createDataRoomSchema } from "@/features/data-room/validation/data-room-schema";


export function useUpdateDataRoomForm(initialName: string) {
	return useForm<CreateDataRoomFormData>({
		resolver: zodResolver(createDataRoomSchema),
		values: { name: initialName },
		defaultValues: { name: initialName },
	});
}
