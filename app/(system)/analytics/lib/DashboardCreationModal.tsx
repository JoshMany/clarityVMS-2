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
import { LayoutDashboard } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { z } from "zod";
import { useDashboardState } from "@/store/analytics";
import { CheckDashboardExistence, CreateDashboard } from "./actions";

export default function DashboardCreationModal({
  isModalOpen,
  setModalOpen,
  swrKey,
}: {
  isModalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  swrKey: string;
}) {
  // Zod Validation Schema
  const DashboardSchema = z.object({
    name: z
      .string({
        required_error: "Dashboard name is required",
        invalid_type_error: "Dashboard name must be a text",
      })
      .min(6, {
        message: "Dashboard name must be at least 6 characters long.",
      })
      .refine(
        async (data) => {
          const res = await CheckDashboardExistence({ dashboardName: data });
          const response = res.status == "true" ? true : false;
          return response;
        },
        { message: "This name is already in use." }
      ),
  });
  // Form Type
  type DashboardType = z.infer<typeof DashboardSchema>;

  //useForm Hook
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<DashboardType>({
    resolver: zodResolver(DashboardSchema),
  });

  const { updateActiveDashboard } = useDashboardState();
  const { mutate } = useSWRConfig();

  const createDashboard = async ({
    dashboardName,
  }: {
    dashboardName: string;
  }) => {
    const ServerResponse = await CreateDashboard({
      dashboardName: dashboardName,
    });
    await mutate(swrKey);
    clearErrors();
    setModalOpen(false);
    if (ServerResponse.dashboardUUID)
      updateActiveDashboard({ uuid: ServerResponse.dashboardUUID });
    return ServerResponse;
  };

  const onSubmit: SubmitHandler<DashboardType> = (data) => {
    toast.promise(createDashboard({ dashboardName: data.name }), {
      loading: "Creating your new dashboard...",
      success: (
        res:
          | {
              message: string;
              status: string;
              dashboardUUID: string;
            }
          | {
              message: string;
              status: string;
              dashboardUUID?: undefined;
            }
      ) => {
        return res.message;
      },
      error:
        "Error creating your dashboard. We suggest you to raise a new review ticket with your system supervisor. 😔",
    });
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onOpenChange={setModalOpen}
      placement="top-center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <form onSubmit={handleSubmit(onSubmit)} id="newDashboardForm">
              <ModalHeader className="flex flex-col gap-1">
                Create a new dashboard
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  endContent={<LayoutDashboard />}
                  labelPlacement="outside"
                  label="Dashboard Name"
                  placeholder="Enter the dashboard name"
                  variant="bordered"
                  autoComplete="new-password"
                  isInvalid={errors?.name ? true : false}
                  errorMessage={errors?.name && errors.name.message}
                  {...register("name")}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit">
                  Create
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
