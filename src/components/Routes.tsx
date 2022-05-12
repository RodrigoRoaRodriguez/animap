import { Route, Routes } from 'react-router-dom'

export const Routes = () => (
  <Routes>
    <Route path="/compensation/:menteeId" element={<CompensationContainer />} />
    <Route path="/network/:menteeId" element={<NetworkContainer />} />
    <Route path="/journeys/:employeeId" element={<JourneyPage />} />
    <Route path="/comparison" element={<ComparisonPage />} />
    <Route
      path="/admin"
      element={
        userIsUnAuthorized() ? (
          <FullScreenAuthErrorOverlay />
        ) : (
          <AdminContainer />
        )
      }
    />
    <Route
      path="/admin/salary-levels"
      element={
        userIsUnAuthorized(UserRoles.ADMIN_EVP) ? (
          <FullScreenAuthErrorOverlay />
        ) : (
          <SalaryLevelsPage />
        )
      }
    />
    <Route
      path="/admin/salary-model"
      element={
        userIsUnAuthorized(UserRoles.ADMIN_SALARY) ? (
          <FullScreenAuthErrorOverlay />
        ) : (
          <SalaryModelContainer />
        )
      }
    />
    <Route path="/" element={<Animap />} />
    {/* <Route path="*" element={<ErrorScreen />} /> */}
  </Routes>
)
