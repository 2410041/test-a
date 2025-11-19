import { List, Datagrid, TextField, NumberField, Edit, Create, SimpleForm, TextInput, NumberInput } from 'react-admin';

export const CompanyList = props => (
  <List {...props} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="c_name" label="企業名" />
      <TextField source="location" label="住所" />
      <NumberField source="employee_count" label="従業員数" />
      <TextField source="homepage_url" label="URL" />
    </Datagrid>
  </List>
);

export const CompanyEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="c_name" label="企業名" fullWidth />
      <TextInput source="location" label="住所" fullWidth />
      <NumberInput source="founded_year" label="設立年" />
      <TextInput source="capital" label="資本金" />
      <NumberInput source="employee_count" label="従業員数" />
      <TextInput source="description" label="説明" fullWidth multiline />
      <TextInput source="homepage_url" label="URL" fullWidth />
      <TextInput source="logo" label="ロゴ" />
      <TextInput source="photo" label="写真" />
    </SimpleForm>
  </Edit>
);

export const CompanyCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="c_name" label="企業名" fullWidth required />
      <TextInput source="location" label="住所" fullWidth />
      <NumberInput source="founded_year" label="設立年" />
      <TextInput source="capital" label="資本金" />
      <NumberInput source="employee_count" label="従業員数" />
      <TextInput source="description" label="説明" fullWidth multiline />
      <TextInput source="homepage_url" label="URL" fullWidth />
      <TextInput source="logo" label="ロゴ" />
      <TextInput source="photo" label="写真" />
    </SimpleForm>
  </Create>
);