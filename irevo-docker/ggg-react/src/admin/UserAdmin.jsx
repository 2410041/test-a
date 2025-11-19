import { List, Datagrid, TextField, EmailField, Edit, Create, SimpleForm, TextInput, DateInput, SelectInput } from 'react-admin';

export const UserList = props => (
  <List {...props} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="u_Lname" label="姓" />
      <TextField source="u_Fname" label="名" />
      <EmailField source="u_Email" label="メール" />
      <TextField source="Employment" label="職業" />
    </Datagrid>
  </List>
);

export const UserEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="u_Lname" label="姓" />
      <TextInput source="u_Fname" label="名" />
      <TextInput source="u_kana" label="カナ" />
      <TextInput source="u_nick" label="ニックネーム" />
      <DateInput source="Birthday" label="誕生日" />
      <SelectInput source="Gender" choices={[{ id: '1', name: '男性' }, { id: '2', name: '女性' }, { id: '0', name: 'その他' }]} />
      <TextInput source="u_Contact" label="連絡先" />
      <TextInput source="u_Email" label="メール" />
      <TextInput source="Employment" label="職業" />
      <TextInput source="u_Address" label="住所" fullWidth />
      <TextInput source="u_Password" label="パスワード(変更時のみ)" type="password" />
    </SimpleForm>
  </Edit>
);

export const UserCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="u_Lname" label="姓" required />
      <TextInput source="u_Fname" label="名" required />
      <TextInput source="u_kana" label="カナ" required />
      <TextInput source="u_nick" label="ニックネーム" required />
      <DateInput source="Birthday" label="誕生日" required />
      <SelectInput source="Gender" choices={[{ id: '1', name: '男性' }, { id: '2', name: '女性' }, { id: '0', name: 'その他' }]} required />
      <TextInput source="u_Contact" label="連絡先" required />
      <TextInput source="u_Email" label="メール" required />
      <TextInput source="Employment" label="職業" required />
      <TextInput source="u_Address" label="住所" fullWidth required />
      <TextInput source="u_Password" label="パスワード" type="password" required />
    </SimpleForm>
  </Create>
);