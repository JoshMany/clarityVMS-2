import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import axios from "axios";
import { Pencil } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { z } from "zod";
import { useDashboardState } from "@/store/analytics";

export default function DashboardRenameModal({
  isRenameModalStatus,
  setRenameModalStatus,
  swrKey,
}: {
  isRenameModalStatus: boolean;
  setRenameModalStatus: Dispatch<SetStateAction<boolean>>;
  swrKey: string;
}) {
  // Zod Validation Schema
  const formSchema = z.object({
    newDashboardName: z
      .string({
        required_error: "Dashboard name is required",
        invalid_type_error: "Dashboard name must be a text",
      })
      .min(6, {
        message: "Dashboard name must be at least 6 characters long.",
      }),
  });
  // Form Type
  type RenameDashboardFormType = z.infer<typeof formSchema>;

  const { activeDashboard } = useDashboardState();
  const { mutate } = useSWRConfig();

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<RenameDashboardFormType>({
    resolver: zodResolver(formSchema),
  });

  const renameDashboard = async (
    newDashboardName: string
  ): Promise<{ new_dashboard_name: string }> => {
    return new Promise(async (resolve, reject) => {
      try {
        const renameDashboardRes = await axios.put(
          `/api/dashboards/${activeDashboard}`,
          {
            newDashboardName: newDashboardName,
          }
        );
        if (renameDashboardRes.status == 200) {
          await mutate(swrKey);
          clearErrors();
          setRenameModalStatus(false);
          resolve(renameDashboardRes.data);
        } else reject();
      } catch (error) {
        reject(error);
      }
    });
  };

  const onSubmit: SubmitHandler<RenameDashboardFormType> = (data) => {
    toast.promise(renameDashboard(data.newDashboardName), {
      loading: "Updating dashboard...",
      success: "Dashboard updated",
      error: "Error",
    });
  };

  return (
    <Modal
      isOpen={isRenameModalStatus}
      onOpenChange={setRenameModalStatus}
      placement="top-center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <form onSubmit={handleSubmit(onSubmit)} id="renameDashboardForm">
              <ModalHeader className="flex flex-col gap-1">
                Rename dashboard
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  endContent={
                    <Pencil
                      className={errors.newDashboardName && "text-danger"}
                    />
                  }
                  key="rename"
                  variant="bordered"
                  isInvalid={errors?.newDashboardName ? true : false}
                  type="text"
                  errorMessage={
                    errors?.newDashboardName && errors.newDashboardName.message
                  }
                  label="New name"
                  labelPlacement="outside"
                  placeholder="Enter the new dashboard name"
                  {...register("newDashboardName")}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit">
                  Rename
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
