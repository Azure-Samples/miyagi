// ** React Imports
import { useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColumns, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid'

// ** ThirdParty Components
import axios from 'axios'

// ** Custom Components

// ** Types Imports
import { OrdersGridRowType } from 'src/@core/utils/types'
import ProductsToolbar from './ProductsToolbar'

type SortType = 'asc' | 'desc' | undefined | null

const columns: GridColumns = [
  {
    flex: 0.25,
    minWidth: 180,
    field: 'productName',
    headerName: 'Product',
    renderCell: (params: GridRenderCellParams) => {
      const { row } = params

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
              {row.productName}
            </Typography>
            <Typography noWrap variant='caption'>
              {row.categoryId}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.175,
    minWidth: 120,
    headerName: 'Created',
    field: 'orderCompletedDate',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.createdAt}
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 110,
    field: 'unitPrice',
    headerName: 'Unit Price',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.unitPrice}
      </Typography>
    )
  },
  {
    flex: 0.125,
    field: 'unitCost',
    minWidth: 150,
    headerName: 'Unit Cost',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        ${params.row.unitCost}
      </Typography>
    )
  }
]

const ProductsTable = () => {
  // ** State
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState<number>(0)
  const [sort, setSort] = useState<SortType>('asc')
  const [pageSize, setPageSize] = useState<number>(7)
  const [rows, setRows] = useState<OrdersGridRowType[]>([])
  const [sortColumn, setSortColumn] = useState<string>('productId')

  function loadServerRows(currentPage: number, data: OrdersGridRowType[]) {
    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  }

  const fetchTableData = useCallback(
    async (sort: SortType, column: string) => {
      await axios
        .get('/api/products', {
          params: {
            sort,
            column
          }
        })
        .then(res => {
          setTotal(res.data.length)
          setRows(loadServerRows(page, res.data))
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, pageSize]
  )

  useEffect(() => {
    fetchTableData(sort, sortColumn)
  }, [fetchTableData, sort, sortColumn])

  const handleSortModel = (newModel: GridSortModel) => {
    if (newModel.length) {
      setSort(newModel[0].sort)
      setSortColumn(newModel[0].field)
      fetchTableData(newModel[0].sort, newModel[0].field)
    } else {
      setSort('asc')
      setSortColumn('productName')
    }
  }

  return (
    <Card>
      <CardHeader title='Products' />
      <DataGrid
        autoHeight
        pagination
        rows={rows}
        rowCount={total}
        columns={columns}
        checkboxSelection
        pageSize={pageSize}
        sortingMode='server'
        paginationMode='server'
        onSortModelChange={handleSortModel}
        getRowId={row => row.productId}
        rowsPerPageOptions={[7, 10, 25, 50]}
        onPageChange={newPage => setPage(newPage)}
        components={{ Toolbar: ProductsToolbar }}
        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
      />
    </Card>
  )
}

export default ProductsTable
