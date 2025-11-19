import { List, Datagrid, TextField, TextInput, Edit, Create, SimpleForm, NumberInput } from 'react-admin';

const filters = [
  <TextInput source="prefecture" label="都道府県" alwaysOn />,
  <TextInput source="city" label="市区町村" />
];

export const LocationList = props => (
  <List {...props} perPage={50} filters={filters}>
    <Datagrid rowClick="show">
      <TextField source="id" label="ID" />
      <TextField source="prefecture" label="都道府県" />
      <TextField source="city" label="市区町村" />
      <TextField source="address_rest" label="残り住所" />
      <TextField source="full_address" label="全文" />
    </Datagrid>
  </List>
);

// 住所編集 (company_id = id)
export const LocationEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="prefecture" label="都道府県" disabled />
      <TextInput source="city" label="市区町村" disabled />
      <TextInput source="address_rest" label="残り住所" disabled />
      <TextInput source="full_address" label="住所（全文）" fullWidth />
    </SimpleForm>
  </Edit>
);

// 住所新規設定（既存の会社に住所を付与）
export const LocationCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <NumberInput source="company_id" label="会社ID" />
      <TextInput source="full_address" label="住所（全文）" fullWidth />
    </SimpleForm>
  </Create>
);