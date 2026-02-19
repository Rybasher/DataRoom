import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { DEFAULT_DATA_ROOM_NAME } from "@/constants/file-system";
import {
	type CreateDataRoomFormData,
	createDataRoomSchema,
} from "@/features/data-room/validation/data-room-schema";

export function useDataRoomForm() {
	return useForm<CreateDataRoomFormData>({
		resolver: zodResolver(createDataRoomSchema),
		defaultValues: {
			name: DEFAULT_DATA_ROOM_NAME,
		},
	});
}
