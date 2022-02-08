import { AddIcon, CopyIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  ButtonGroup,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  HStack,
  IconButton,
  Spinner,
  useColorMode,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import useScrollbarSize from "react-scrollbar-size";
import { Database, QueryParameters } from "../data/database";
import {
  Ingredient,
  IngredientInterface,
  yupIngredientSchema,
} from "../data/models/ingredient";
import { IngredientForm } from "../forms/IngredientForm";

const IngredientsPage = () => {
  const { colorMode } = useColorMode();
  const { height } = useScrollbarSize();
  const [data, setData] = useState<Array<IngredientInterface>>([]);
  const [formDrawerIsOpen, setFormDrawerIsOpen] = useState(false);
  const [updateIngredient, setUpdateIngredient] = useState<
    IngredientInterface | undefined
  >(undefined);
  const [deleteIngredient, setDeleteIngredient] = useState<
    IngredientInterface | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);
  const [dataCount, setDataCount] = useState(0);
  const [queryParameters, setQueryParameters] = useState<QueryParameters>({
    offset: 0,
    limit: 10,
  });
  const [numberOfCellsForUsableHeight, setNumberOfCellsForUsableHeight] =
    useState<number | undefined>(undefined);

  async function queryData() {
    setLoading(true);
    setData(
      (await Database.shared().arrayOfIngredients(queryParameters)) ?? []
    );
    setDataCount(await Database.shared().countOfIngredients());
    setLoading(false);
  }

  function handleResize() {
    const usableHeight = (window.innerHeight ?? 0) - 64 - 75 - 56;
    const cellHeight = 48;
    const numberOfCellsForUsableHeight =
      Math.round(usableHeight / cellHeight) - 2;
    setNumberOfCellsForUsableHeight(numberOfCellsForUsableHeight);
    setQueryParameters({
      ...queryParameters,
      limit: numberOfCellsForUsableHeight,
    });
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      handleResize();
      queryData();
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    queryData();
  }, [queryParameters]);

  if (numberOfCellsForUsableHeight === undefined) {
    return (
      <Center pt="5">
        <Spinner />
      </Center>
    );
  }

  return (
    <Box>
      <HStack p="4">
        <Box flex="1">
          <Heading>Ingredients</Heading>
        </Box>
        <Box>
          <IconButton
            onClick={() => setFormDrawerIsOpen(true)}
            icon={<AddIcon />}
            aria-label="Add"
          />
        </Box>
      </HStack>

      <DataTable
        fixedHeader
        theme={colorMode === "light" ? "default" : "dark"}
        responsive
        customStyles={{
          table: {
            style: {
              height: `calc(100vh - 64px - 75px - 56px - ${height}px)`,
            },
          },
        }}
        columns={[
          {
            cell: (row: IngredientInterface) => (
              <ButtonGroup>
                <IconButton
                  size={"xs"}
                  icon={<EditIcon />}
                  aria-label="Edit"
                  onClick={() => {
                    setUpdateIngredient(row);
                    setFormDrawerIsOpen(true);
                  }}
                />
                <IconButton
                  size={"xs"}
                  icon={<DeleteIcon />}
                  aria-label="Delete"
                  onClick={() => {
                    setDeleteIngredient(row);
                  }}
                />
                <IconButton
                  size={"xs"}
                  icon={<CopyIcon />}
                  aria-label="Duplicate"
                />
              </ButtonGroup>
            ),

            center: true,
          },
          {
            name: yupIngredientSchema.fields.name.spec.label,
            selector: (row: Ingredient) => row.name,
          },
          {
            name: yupIngredientSchema.fields.priceCents.spec.label,
            selector: (row: Ingredient) => row.priceCents,
            center: true,
          },
          {
            name: yupIngredientSchema.fields.servingCount.spec.label,
            selector: (row: Ingredient) => row.servingCount,
            center: true,
          },
          {
            name: yupIngredientSchema.fields.servingMassGrams.spec.label,
            selector: (row: Ingredient) => row.servingMassGrams,
            center: true,
          },
          {
            name: yupIngredientSchema.fields.servingEnergyKilocalorie.spec
              .label,
            selector: (row: Ingredient) => row.servingEnergyKilocalorie,
            center: true,
          },
          {
            name: yupIngredientSchema.fields.servingFatGrams.spec.label,
            selector: (row: Ingredient) => row.servingFatGrams,
            center: true,
          },
          {
            name: yupIngredientSchema.fields.servingCarbohydrateGrams.spec
              .label,
            selector: (row: Ingredient) => row.servingCarbohydrateGrams,
            center: true,
          },
          {
            name: yupIngredientSchema.fields.servingProteinGrams.spec.label,
            selector: (row: Ingredient) => row.servingProteinGrams,
            center: true,
          },
        ]}
        data={data}
        progressPending={loading}
        pagination
        paginationServer
        paginationServerOptions={{
          persistSelectedOnSort: true,
          persistSelectedOnPageChange: true,
        }}
        paginationTotalRows={dataCount}
        onChangeRowsPerPage={async (currentRowsPerPage: number) => {
          setQueryParameters({ ...queryParameters, limit: currentRowsPerPage });
        }}
        paginationPerPage={queryParameters.limit}
        paginationComponentOptions={
          {
            // noRowsPerPage: true,
          }
        }
        paginationRowsPerPageOptions={[numberOfCellsForUsableHeight ?? 1]}
        onChangePage={(page: number) => {
          setQueryParameters({
            limit: queryParameters.limit,
            offset: (page - 1) * queryParameters.limit,
          });
        }}
      />
      <Drawer
        isOpen={formDrawerIsOpen}
        placement="right"
        onClose={() => setFormDrawerIsOpen(false)}
        finalFocusRef={undefined}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {updateIngredient ? "Update" : "Create"} ingredient
          </DrawerHeader>

          <DrawerBody>
            <IngredientForm
              ingredient={updateIngredient}
              onSubmit={async (ingredient) => {
                var id = await Database.shared().putIngredient(ingredient);

                queryData();
                setUpdateIngredient(undefined);
                setFormDrawerIsOpen(false);
                return id;
              }}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <AlertDialog
        isOpen={deleteIngredient !== undefined}
        onClose={() => setDeleteIngredient(undefined)}
        leastDestructiveRef={undefined}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Ingredient</AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <ButtonGroup>
                <Button onClick={() => setDeleteIngredient(undefined)}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={async () => {
                    await Database.shared().deleteIngredient(
                      deleteIngredient?.id!
                    );
                    setDeleteIngredient(undefined);
                    queryData();
                  }}
                >
                  Delete
                </Button>
              </ButtonGroup>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default IngredientsPage;

/*

*/
