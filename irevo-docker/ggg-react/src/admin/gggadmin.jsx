import { Admin, Resource, ListGuesser, Layout, Menu, AppBar } from 'react-admin';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaymentIcon from '@mui/icons-material/Payment';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BarChartIcon from '@mui/icons-material/BarChart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import { Button, Box } from '@mui/material';
import { dataProvider } from './dataProvider';
import Dashboard from './Dashboard';
import { CompanyList, CompanyEdit, CompanyCreate } from './CompanyAdmin';
import { UserList, UserEdit, UserCreate } from './UserAdmin';
import { LocationList, LocationEdit, LocationCreate } from './LocationList';

// カスタムメニュー
const CustomMenu = () => (
  <Menu>
    <Menu.DashboardItem primaryText="ダッシュボード" />
    <Menu.ResourceItems />
  </Menu>
);

// カスタムAppBar（ヘッダー）
const CustomAppBar = () => (
  <AppBar>
    <Box sx={{ flex: 1 }} />
    <Button
      color="inherit"
      startIcon={<HomeIcon />}
      href="/"
      sx={{ 
        color: 'white',
        borderRadius: 2,
        px: 2,
        py: 1,
        transition: 'all 0.2s ease',
        '&:hover': { 
          backgroundColor: 'rgba(255, 255, 255, 1)',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        },
        '&:active': {
          transform: 'translateY(0px)'
        }
      }}
    >
      ホームに戻る
    </Button>
  </AppBar>
);

// カスタムレイアウト
const CustomLayout = (props) => (
  <Layout {...props} menu={CustomMenu} appBar={CustomAppBar} />
);

export default function GggAdmin() {
  return (
    <Admin 
      dataProvider={dataProvider} 
      dashboard={Dashboard}
      basename="/Admin"
      title="管理者画面"
      layout={CustomLayout}
    >
      <Resource 
        name="users" 
        list={UserList} 
        edit={UserEdit} 
        create={UserCreate} 
        icon={PeopleIcon}
        options={{ label: 'ユーザー管理' }}
      />
      <Resource 
        name="companies" 
        list={CompanyList} 
        edit={CompanyEdit} 
        create={CompanyCreate} 
        icon={BusinessIcon}
        options={{ label: '企業管理' }}
      />
      <Resource 
        name="locations" 
        list={LocationList} 
        edit={LocationEdit} 
        create={LocationCreate} 
        icon={LocationOnIcon}
        options={{ label: '住所・地域管理' }}
      />
      {/* <Resource 
        name="payments" 
        list={ListGuesser} 
        icon={PaymentIcon}
        options={{ label: '決済管理' }}
      />
      <Resource 
        name="jobs" 
        list={ListGuesser} 
        icon={AssignmentIcon}
        options={{ label: '求人・応募管理' }}
      />
      <Resource 
        name="location" 
        list={LocationList} 
        options={{ label: 'ロケーション管理' }}
      /> */}
      {/* <Resource 
        name="reports" 
        list={ListGuesser} 
        icon={BarChartIcon}
        options={{ label: 'レポート・分析' }}
      /> */}
    </Admin>
  );
}

