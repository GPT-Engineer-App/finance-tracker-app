import React, { useState } from "react";
import { Box, Button, Container, FormControl, FormLabel, Input, Select, VStack, HStack, Text, IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useToast } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";

const initialTransactions = [
  {
    id: 1,
    date: "2023-01-01",
    amount: 1000,
    type: "income",
    category: "salary",
  },
  {
    id: 2,
    date: "2023-01-02",
    amount: 50,
    type: "expense",
    category: "groceries",
  },
];

const categories = ["groceries", "bills", "salary", "entertainment", "healthcare", "other"];

const Index = () => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({ type: "", category: "", dateFrom: "", dateTo: "" });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    onOpen();
  };

  const handleDelete = (transactionId) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== transactionId));
    toast({
      title: "Transaction deleted.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredTransactions = transactions.filter((transaction) => {
    return (filters.type ? transaction.type === filters.type : true) && (filters.category ? transaction.category === filters.category : true) && (filters.dateFrom ? new Date(transaction.date) >= new Date(filters.dateFrom) : true) && (filters.dateTo ? new Date(transaction.date) <= new Date(filters.dateTo) : true);
  });

  const totalBalance = transactions.reduce((acc, transaction) => {
    return transaction.type === "income" ? acc + transaction.amount : acc - transaction.amount;
  }, 0);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newTransaction = {
      id: editingTransaction ? editingTransaction.id : Math.max(...transactions.map((t) => t.id), 0) + 1,
      date: formData.get("date"),
      amount: parseFloat(formData.get("amount")),
      type: formData.get("type"),
      category: formData.get("category"),
    };

    if (editingTransaction) {
      setTransactions(transactions.map((transaction) => (transaction.id === editingTransaction.id ? newTransaction : transaction)));
      setEditingTransaction(null);
    } else {
      setTransactions([...transactions, newTransaction]);
    }

    onClose();
    toast({
      title: `Transaction ${editingTransaction ? "updated" : "added"}.`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.md" py={5}>
      <VStack spacing={4} align="stretch">
        <Box>
          <Text fontSize="2xl">Total Balance: ${totalBalance.toFixed(2)}</Text>
        </Box>
        <Box>
          <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={() => handleEdit(null)}>
            Add Transaction
          </Button>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>Type</FormLabel>
            <Select placeholder="All" name="type" onChange={handleFilterChange}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Select>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Category</FormLabel>
            <Select placeholder="All" name="category" onChange={handleFilterChange}>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </FormControl>
          <HStack mt={4}>
            <FormControl>
              <FormLabel>Date From</FormLabel>
              <Input type="date" name="dateFrom" onChange={handleFilterChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Date To</FormLabel>
              <Input type="date" name="dateTo" onChange={handleFilterChange} />
            </FormControl>
          </HStack>
        </Box>
        <Box>
          <Text fontSize="xl">Transactions</Text>
          <VStack spacing={4}>
            {filteredTransactions.map((transaction) => (
              <HStack key={transaction.id} justify="space-between" p={4} borderWidth="1px" borderRadius="md">
                <VStack align="start">
                  <Text fontSize="md">{transaction.date}</Text>
                  <Text fontSize="md">${transaction.amount.toFixed(2)}</Text>
                  <Text fontSize="md" color={transaction.type === "income" ? "green.500" : "red.500"}>
                    {transaction.type}
                  </Text>
                  <Text fontSize="md">{transaction.category}</Text>
                </VStack>
                <HStack>
                  <IconButton aria-label="Edit" icon={<FaEdit />} onClick={() => handleEdit(transaction)} />
                  <IconButton aria-label="Delete" icon={<FaTrashAlt />} onClick={() => handleDelete(transaction.id)} />
                </HStack>
              </HStack>
            ))}
          </VStack>
        </Box>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit}>
          <ModalHeader>{editingTransaction ? "Edit Transaction" : "New Transaction"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Date</FormLabel>
              <Input type="date" name="date" defaultValue={editingTransaction?.date} required />
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>Amount</FormLabel>
              <Input type="number" step="0.01" name="amount" defaultValue={editingTransaction?.amount} required />
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>Type</FormLabel>
              <Select name="type" defaultValue={editingTransaction?.type} required>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </Select>
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>Category</FormLabel>
              <Select name="category" defaultValue={editingTransaction?.category} required>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" type="submit">
              {editingTransaction ? "Update" : "Add"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Index;
