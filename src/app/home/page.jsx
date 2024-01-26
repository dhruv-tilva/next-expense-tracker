"use client";
import {
  addExpense,
  deleteExpense,
  getExpense,
  updateExpense,
} from "@/api/expense";
import DeleteIcon from "@/assets/delete-icon";
import EditIcon from "@/assets/edit-icon";
import Header from "@/components/common/header";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast, useToast } from "@/components/ui/use-toast";
import useAuthStore from "@/store/auth";
import { getUserCookie } from "@/utils";
import { addExpenseFormSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getAuth, deleteUser } from "firebase/auth";

const defaultValue = {
  location_name: "",
  location_address: "",
  amount: "",
  items: "",
};
const user = JSON.parse(getUserCookie());
console.log(user);

const Home = () => {
  // const auth = getAuth();
  // const user = auth.currentUser;
  // console.log("user", user);
  const { loading, setLoading } = useAuthStore();
  const [isEdit, setIsEdit] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(defaultValue);
  const [expenses, setExpenses] = useState([]);

  const getExpenseList = async () => {
    setLoading(true);
    await getExpense(user?.uid)
      .then((res) => {
        // const filterExpenses = res.filter((_) => _.uid === user.uid);
        setExpenses(res);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getExpenseList();
  }, []);

  return (
    <>
      <Header />
      <div className="px-4 mt-5">
        <AddExpenseDialog
          open={openDialog}
          setOpen={setOpenDialog}
          expenseList={expenses}
          setExpenseList={setExpenses}
          selectedExpense={selectedExpense}
          resetSelectedExpense={() => {
            setSelectedExpense(defaultValue);
          }}
          loading={loading}
          setLoading={setLoading}
          getExpenseList={getExpenseList}
        >
          <button className="text-primary text-lg font-bold">
            + Add Expense
          </button>
        </AddExpenseDialog>
      </div>
      {loading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <Spinner className="text-primary w-16 h-16" />
        </div>
      ) : (
        <div className="space-y-2">
          {expenses.map((exp) => {
            return (
              <div className="flex w-full flex-col justify-between items-center bg-orange-50 p-3 border-b border-orange-300 md:flex-row md:w-[700px] md:mx-auto">
                <div className="grid grid-cols-2 w-3/5">
                  <p>{exp?.time}</p>
                  <p>
                    {exp?.location_address} - {exp?.location_name}
                  </p>
                  <p className="text-red-700 font-bold">₹ {exp?.amount}</p>
                  <p>{exp?.items}</p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    size="default"
                    className="w-10 m-1 md:px-2 bg-orange-200 group"
                    variant="secondary"
                    onClick={() => {
                      setOpenDialog(true);
                      setIsEdit(true);
                      setSelectedExpense(exp);
                    }}
                  >
                    <EditIcon className="w-5 h-5 text-orange-400 group-hover:text-orange-800" />
                  </Button>
                  <DeleteExpenseDialog
                    open={deleteDialogOpen}
                    setOpen={setDeleteDialogOpen}
                    expenseId={exp.id}
                    loading={loading}
                    setLoading={setLoading}
                    getExpenseList={getExpenseList}
                  >
                    <Button
                      size="default"
                      className="w-10 m-1 md:px-2 bg-orange-200 group"
                      variant="secondary"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <DeleteIcon className="w-5 h-5 text-orange-400 group-hover:text-orange-800" />
                    </Button>
                  </DeleteExpenseDialog>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export const AddExpenseDialog = ({
  children,
  open,
  setOpen,
  expenseList,
  setExpenseList,
  selectedExpense,
  resetSelectedExpense,
  loading,
  setLoading,
  getExpenseList,
}) => {
  const addExpenseForm = useForm({
    resolver: zodResolver(addExpenseFormSchema),
    defaultValues: {
      location_name: selectedExpense.location_name,
      location_address: selectedExpense.location_address,
      items: selectedExpense.items,
      amount: selectedExpense.amount,
    },
  });
  const { toast } = useToast();

  const date = new Date().getDate();
  const month =
    new Date().getMonth() < 10
      ? "0" + (new Date().getMonth() + 1)
      : new Date().getMonth();
  const year = new Date().getFullYear();

  useEffect(() => {
    addExpenseForm.setValue("location_name", selectedExpense.location_name);
    addExpenseForm.setValue(
      "location_address",
      selectedExpense.location_address
    );
    addExpenseForm.setValue("items", selectedExpense.items);
    addExpenseForm.setValue("amount", selectedExpense.amount);
  }, [selectedExpense]);

  const onSubmit = async () => {
    let { location_name } = addExpenseForm.getValues();
    let { location_address } = addExpenseForm.getValues();
    let { items } = addExpenseForm.getValues();
    let { amount } = addExpenseForm.getValues();
    const time = date + "/" + month + "/" + year;
    let uid = user?.uid;

    if (selectedExpense.id) {
      const id = selectedExpense.id;
      setLoading(true);
      await updateExpense({
        id,
        uid,
        location_name,
        location_address,
        items,
        amount,
        time,
      })
        .then(() => {
          toast({
            variant: "success",
            title: "Expense Updated Successfully!!",
          });
          setOpen(false);
          getExpenseList();
          resetSelectedExpense();
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: "Something went wrong!!",
          });
        });
    } else {
      setLoading(true);
      await addExpense({
        uid,
        location_name,
        location_address,
        items,
        amount,
        time,
      })
        .then((res) => {
          console.log(res);
          toast({
            varient: "success",
            title: "Expense Added Successfully",
          });
          setOpen(false);
          getExpenseList();
          resetSelectedExpense();
        })
        .catch((error) => {
          debugger;
          console.log("error catch");
          toast({
            varient: "destructive",
            title: "Something went wrong!!",
          });
        })
        .finally(() => setLoading(false));
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent closeButton={false} className="bg-orange-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            {selectedExpense.id ? "Update Expense" : "Add Expense"}
          </DialogTitle>
        </DialogHeader>
        <Form {...addExpenseForm}>
          <form
            action=""
            className="text-primary"
            onSubmit={addExpenseForm.handleSubmit(onSubmit)}
          >
            <FormField
              key="location_name"
              control={addExpenseForm.control}
              name="location_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative mt-3 space-y-1">
                      <FormLabel>Location Name</FormLabel>
                      <Input
                        type="text"
                        name="location_name"
                        data-name="location_name"
                        placeholder="Enter location name"
                        readOnly={loading}
                        id="title"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              key="location_address"
              control={addExpenseForm.control}
              name="location_address"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative mt-3 space-y-1">
                      <FormLabel>Location Address</FormLabel>
                      <Input
                        type="text"
                        name="location_address"
                        data-name="location_address"
                        placeholder="Enter location address"
                        readOnly={loading}
                        id="title"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              key="items"
              control={addExpenseForm.control}
              name="items"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative mt-3 space-y-1">
                      <FormLabel>Items</FormLabel>
                      <Input
                        type="text"
                        name="items"
                        data-name="items"
                        placeholder="Enter itmes"
                        readOnly={loading}
                        id="items"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              key="amount"
              control={addExpenseForm.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative mt-3 space-y-1">
                      <FormLabel>Amount</FormLabel>
                      <Input
                        type="text"
                        name="amount"
                        placeholder="₹ 0"
                        {...field}
                        onInput={(e) => {
                          if (e.target.value === "0") e.target.value = "";
                          if (!/^\d{0,5}(\.\d{0,2})?$/.test(e.target.value))
                            e.target.value = field.value;
                          field.onChange(e);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="default"
              className="w-full rounded-3xl mt-5"
              disabled={loading}
            >
              {selectedExpense.id ? "Update Expense" : "Add Expense"}
            </Button>

            <Button
              type="button"
              size="default"
              className="block w-full mt-2.5"
              variant="secondary"
              onClick={() => {
                setOpen(false);
                resetSelectedExpense();
              }}
            >
              Back
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const DeleteExpenseDialog = ({
  children,
  open,
  setOpen,
  expenseId,
  loading,
  setLoading,
  getExpenseList,
}) => {
  const dltExpense = async () => {
    setLoading(true);
    await deleteExpense(expenseId)
      .then(() => {
        toast({
          variant: "success",
          title: "Expense Deleted Successfully!!",
        });
        getExpenseList();
        setOpen(false);
      })
      .finally(() => setLoading(false));
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are You Sure Want to Delete Expense?</DialogTitle>
          </DialogHeader>
          <div>
            <Button
              type="submit"
              size="default"
              className="w-full rounded-3xl mt-5"
              disabled={loading}
              onClick={() => dltExpense()}
            >
              Delete Expense
            </Button>

            <Button
              type="button"
              size="default"
              className="block w-full mt-2.5"
              variant="secondary"
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Home;
