import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  ButtonGroup,
  Center,
  IconButton,
  Show,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Pagination } from "../components/Pagination";
import { AppContext } from "../context/AppContext";
import { Database, ItemQueryParameters } from "../data/Database";
import { ItemInferredType, yupItemSchema } from "../data/model/Item";
import { ItemType } from "../data/model/ItemType";

const RecipesPage = () => {
  const [data, setData] = useState<Array<ItemInferredType> | undefined>(
    undefined
  );
  const [dataCount, setDataCount] = useState<number | undefined>(undefined);
  const [progressPending, setProgressPending] = useState(false);
  const [queryParameters, setQueryParameters] = useState<ItemQueryParameters>({
    type: ItemType.recipe,
    page: 0,
    limit: 1,
    reverse: false,
  });
  const pages = Math.floor((dataCount ?? 0) / queryParameters.limit);
  if (dataCount !== undefined && queryParameters.page > pages) {
    setQueryParameters({ ...queryParameters, page: pages });
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  const [numberOfCellsForUsableHeight, setNumberOfCellsForUsableHeight] =
    useState<number | undefined>(undefined);

  async function queryData() {
    setProgressPending(data === undefined);
    // setData((await Database.shared().arrayOfItems(queryParameters)) ?? []);
    // setDataCount(await Database.shared().countOfItems(queryParameters));
    setProgressPending(false);
  }

  function handleResize() {
    const usableHeight = (window.innerHeight ?? 0) - 64 * 2 - 40;
    const cellHeight = 73;
    const newNumberOfCellsForUsableHeight = Math.floor(
      usableHeight / cellHeight
    );
    if (newNumberOfCellsForUsableHeight !== queryParameters.limit) {
      setNumberOfCellsForUsableHeight(newNumberOfCellsForUsableHeight);
      setQueryParameters({
        ...queryParameters,
        limit: newNumberOfCellsForUsableHeight,
      });
    }
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

  return progressPending || numberOfCellsForUsableHeight === undefined ? (
    <Center>
      <Spinner />
    </Center>
  ) : (
    <AppContext.Consumer>
      {(appStateValue) => (
        <Box>
          <Table>
            <Thead>
              <Tr>
                <Th>
                  <Center>Actions</Center>
                </Th>
                <Th>{yupItemSchema.fields.name.spec.label}</Th>
                <Th isNumeric>{yupItemSchema.fields.priceCents.spec.label}</Th>
                <Show above="md">
                  <Th isNumeric>{yupItemSchema.fields.count.spec.label}</Th>
                </Show>
                <Show above="lg">
                  <Th isNumeric>{yupItemSchema.fields.massGrams.spec.label}</Th>
                </Show>
                <Show above="xl">
                  <Th isNumeric>
                    {yupItemSchema.fields.energyKilocalorie.spec.label}
                  </Th>
                </Show>
                <Show above="2xl">
                  <Th isNumeric>{yupItemSchema.fields.fatGrams.spec.label}</Th>
                  <Th isNumeric>
                    {yupItemSchema.fields.carbohydrateGrams.spec.label}
                  </Th>
                  <Th isNumeric>
                    {yupItemSchema.fields.proteinGrams.spec.label}
                  </Th>
                </Show>
              </Tr>
            </Thead>
            <Tbody>
              {data?.map((value) => {
                const nutritionInfo = Database.shared().itemNutrition(
                  value,
                  true
                );
                const price = Database.shared().itemPrice(value, true);
                return (
                  <Tr key={value.id}>
                    <Td>
                      <Center>
                        <ButtonGroup isAttached>
                          <IconButton
                            icon={<EditIcon />}
                            aria-label="Edit"
                            onClick={() => {
                              appStateValue.setAppState!({
                                updateItem: value,
                                recipeFormDrawerIsOpen: true,
                              });
                            }}
                          />
                          <IconButton
                            icon={<DeleteIcon />}
                            aria-label="Delete"
                            onClick={() => {
                              appStateValue.setAppState!({ deleteItem: value });
                            }}
                          />
                        </ButtonGroup>
                      </Center>
                    </Td>
                    <Td>
                      <Text noOfLines={2}>{value.name}</Text>
                    </Td>
                    <Td isNumeric>{formatter.format(price / 100)}</Td>
                    <Show above="md">
                      <Td isNumeric>{value.count}</Td>
                    </Show>
                    <Show above="lg">
                      <Td isNumeric>{nutritionInfo.massGrams}g</Td>
                    </Show>
                    <Show above="xl">
                      <Td isNumeric>{nutritionInfo.energyKilocalorie}</Td>
                    </Show>
                    <Show above="2xl">
                      <Td isNumeric>{nutritionInfo.fatGrams}g</Td>
                      <Td isNumeric>{nutritionInfo.carbohydrateGrams}g</Td>
                      <Td isNumeric>{nutritionInfo.proteinGrams}g</Td>
                    </Show>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
          <Center p={3} position="fixed" bottom="0" width="100%">
            <Pagination
              onSetPage={(page) => {
                setQueryParameters({ ...queryParameters, page });
              }}
              page={queryParameters.page}
              pages={pages}
            />
          </Center>
        </Box>
      )}
    </AppContext.Consumer>
  );
};

export default RecipesPage;
