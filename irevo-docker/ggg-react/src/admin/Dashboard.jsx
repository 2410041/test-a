import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import BusinessIcon from '@mui/icons-material/Business';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import SecurityIcon from '@mui/icons-material/Security';
import EmailIcon from '@mui/icons-material/Email';
import StorageIcon from '@mui/icons-material/Storage';

const managementTiles = [
  { icon: <PeopleIcon fontSize="large" />, label: 'ユーザー管理', href: '/Admin/users', desc: 'ユーザー情報の編集・削除' },
  { icon: <BusinessIcon fontSize="large" />, label: '企業管理', href: '/Admin/companies', desc: '企業情報・求人管理' },
  { icon: <LocationOnIcon fontSize="large" />, label: '住所・地域管理', href: '/Admin/locations', desc: '地域データ・住所管理' },
  // { icon: <PaymentIcon fontSize="large" />, label: '決済管理', href: '/Admin/payments', desc: '決済履歴・設定管理' },
  // { icon: <AssignmentIcon fontSize="large" />, label: '求人・応募管理', href: '/Admin/jobs', desc: '求人投稿・応募状況' },
  // { icon: <BarChartIcon fontSize="large" />, label: 'レポート・分析', href: '/Admin/reports', desc: 'アクセス解析・統計' },
];

const systemTiles = [
  { icon: <SettingsIcon fontSize="large" />, label: 'システム設定', href: '/Admin/settings', desc: 'サイト基本設定' },
  { icon: <SecurityIcon fontSize="large" />, label: 'セキュリティ管理', href: '/Admin/security', desc: '権限・ログ管理' },
  { icon: <EmailIcon fontSize="large" />, label: 'メール設定', href: '/Admin/mail', desc: 'メール配信・テンプレート' },
  { icon: <StorageIcon fontSize="large" />, label: 'データベース管理', href: '/Admin/database', desc: 'バックアップ・復元' },
];

const cardSx = {
  height: 220,
  backgroundColor: '#ffffff',
  border: '1px solid #e0e0e0',
  borderRadius: 2,
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  transition: 'all 0.2s ease',
  '&:hover': { 
    backgroundColor: '#f8f9fa',
    borderColor: '#c0c0c0',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    transform: 'translateY(-2px)',
  },
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: 380,
};

const cardContentSx = {
  textAlign: 'center',
  p: 3,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const sectionTitleSx = {
  fontSize: '1.25rem',
  fontWeight: 600,
  color: '#424242',
  textAlign: 'left',
  mb: 3,
  pl: 1,
  borderLeft: '4px solid #2196f3',
};

export default function Dashboard() {
  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        <Typography variant="h4" sx={{ mb: 6, fontWeight: 600, color: '#333333', textAlign: 'center' }}>
          管理者ダッシュボード
        </Typography>
        
        {/* メイン管理機能 */}
        <Typography sx={sectionTitleSx}>
          メイン管理機能
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: 3,
          mb: 6 
        }}>
          {managementTiles.map((tile) => (
            <Card key={tile.label} sx={cardSx}>
              <CardContent sx={cardContentSx}>
                <Box>
                  <Box sx={{ mb: 2, color: '#2196f3' }}>{tile.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#333333', fontSize: '1.1rem' }}>
                    {tile.label}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: '#666666', lineHeight: 1.5, fontSize: '0.875rem' }}>
                    {tile.desc}
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  href={tile.href} 
                  size="small"
                  sx={{ 
                    backgroundColor: '#2196f3',
                    color: '#ffffff',
                      '&:hover': { 
                      color: '#ffffffff',
                      backgroundColor: '#000000ff',
                    },
                    fontWeight: 500,
                    textTransform: 'none',
                    px: 3,
                    alignSelf: 'center',
                  }}
                >
                  開く
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
        
        {/* システム設定 */}
        <Typography sx={sectionTitleSx}>
          システム設定・運用
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: 3 
        }}>
          {systemTiles.map((tile) => (
            <Card key={tile.label} sx={cardSx}>
              <CardContent sx={cardContentSx}>
                <Box>
                  <Box sx={{ mb: 2, color: '#757575' }}>{tile.icon}</Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#333333', fontSize: '1.1rem' }}>
                    {tile.label}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: '#666666', fontSize: '0.875rem', lineHeight: 1.4 }}>
                    {tile.desc}
                  </Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  href={tile.href} 
                  size="small"
                  sx={{ 
                    borderColor: '#757575',
                    color: '#757575',
                    '&:hover': { 
                      borderColor: '#424242',
                      color: '#424242',
                      backgroundColor: '#f5f5f5'
                    },
                    fontWeight: 500,
                    textTransform: 'none',
                    px: 2,
                    alignSelf: 'center',
                  }}
                >
                  設定
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}