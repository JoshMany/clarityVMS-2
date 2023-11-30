"use client";
import { useTitle } from "@/app/components/Layout/LayoutStructure";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useEffect } from "react";
import { Box, KeyIcon, Mail, PlusIcon, User } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DataTable from "@/app/components/DataTable";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Page() {
  const { updateTitle } = useTitle();
  useEffect(() => {
    updateTitle("Job Requisitions 🗂️");
  }, [updateTitle]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const AddModal = () => {
    interface FormValues {
      newUsername: string;
      newEmail: string;
      newPassword: string;
      newRole: number;
    }

    const schema = yup.object().shape({
      newUsername: yup
        .string()
        .required("Username is a required field.")
        .min(6, "The username must have 6 characters at least.")
        .max(18, "The username must have 16 characters at most."),
      newEmail: yup.string().required().email(),
      newPassword: yup.string().required().min(8).max(32),
      newRole: yup.number().required(),
    });

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<FormValues>({ resolver: yupResolver(schema) });
    const onSubmit: SubmitHandler<FormValues> = (data) => console.log(data);

    const roles = [
      { name: "Data1", id: 1 },
      { name: "Data2", id: 2 },
    ];

    return (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add new user
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  autoComplete="off"
                  id="newUserForm"
                  className="flex flex-col gap-5"
                >
                  <Input
                    type="text"
                    label="Username"
                    endContent={<User />}
                    validationState={errors.newUsername ? "invalid" : "valid"}
                    errorMessage={
                      errors.newUsername ? errors.newUsername.message : null
                    }
                    {...register("newUsername")}
                  />
                  <Input
                    type="email"
                    label="Email"
                    endContent={<Mail />}
                    validationState={errors.newEmail ? "invalid" : "valid"}
                    errorMessage={
                      errors.newEmail ? errors.newEmail.message : null
                    }
                    {...register("newEmail")}
                  />
                  <Input
                    type="password"
                    label="Password"
                    autoComplete="new-password"
                    endContent={<KeyIcon />}
                    validationState={errors.newPassword ? "invalid" : "valid"}
                    errorMessage={
                      errors.newPassword ? errors.newPassword.message : null
                    }
                    {...register("newPassword")}
                  />
                  <Select
                    label="Select a role"
                    endContent={<Box />}
                    isInvalid={errors.newRole ? false : true}
                    errorMessage={
                      errors.newRole ? errors.newRole.message : null
                    }
                    {...register("newRole")}
                  >
                    {roles.map((role: { name: string; id: number }) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </Select>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit" form="newUserForm">
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-h-max flex flex-row justify-between items-center my-2">
        <h1 className="font-medium text-lg">Data Table</h1>
        <Button
          size="md"
          color="primary"
          endContent={<PlusIcon />}
          onPress={onOpen}
        >
          Add new register
        </Button>
      </div>

      <>{isOpen && <AddModal />}</>
      <DataTable />
    </div>
  );
}
