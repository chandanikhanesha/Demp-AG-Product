import React, { Component } from 'react';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { capitalize } from 'lodash/string';
import { isEmpty } from 'lodash/lang';
import { sortBy } from 'lodash';

import { numberToDollars, customerProductDiscountsTotals } from '../../../utilities';
import { getProductFromOrder, getProductName } from '../../../utilities/product';
import { getAppliedDiscounts } from '../../../utilities/purchase_order';

import { breakDownStyles } from './breakdown.styles';
const typesMap = {
  B: 'SOYBEAN',
  C: 'CORN',
  S: 'SORGHUM',
  // A: 'ALFALFA',
  L: 'CANOLA',
  P: 'PACKAGING',
};
const cropTypesMonsanto = ['B', 'C', 'S', 'L', 'P'];
class InvoiceBreakdown extends Component {
  state = {
    companyColumns: [
      {
        Header: 'Product',
        accessor: 'product',
        width: 160,
        headerStyle: {
          fontSize: this.props.selectedFontSize,
          fontWeight: 'bold',
        },
      },
      // {
      //   Header: 'Type',
      //   accessor: 'type',
      //   width: 60,
      //   headerStyle: {
      //     fontSize: this.props.selectedFontSize,
      //     fontWeight: 'bold',
      //   },
      // },
      // {
      //   Header: 'Description',
      //   accessor: 'description'
      // },
      // {
      //   Header: "ID",
      //   accessor: "id",
      //   width:30
      // },
      // {
      //   Header: "Unit",
      //   accessor: "unit",
      //   width:45
      // },
      {
        Header: 'Units',
        accessor: 'numberOfUnit',
        width: 80,
        headerStyle: {
          fontSize: this.props.selectedFontSize,
          fontWeight: 'bold',
        },
      },
      {
        Header: 'MSRP',
        accessor: 'msrp',
        width: 70,
        headerStyle: {
          fontSize: this.props.selectedFontSize,
          fontWeight: 'bold',
        },
      },
      {
        Header: 'Item Total',
        accessor: 'itemTotal',
        width: 120,
        headerStyle: {
          fontSize: this.props.selectedFontSize,
          fontWeight: 'bold',
        },
      },
      {
        Header: 'Discounts',
        accessor: 'discounts',
        width: 160,
        headerStyle: {
          fontSize: this.props.selectedFontSize,
          fontWeight: 'bold',
        },
      },
      {
        Header: 'Final MSRP',
        accessor: 'netPrice',
        width: 100,
        headerStyle: {
          fontSize: this.props.selectedFontSize,
          fontWeight: 'bold',
        },
      },
      {
        Header: 'Total $',
        accessor: 'total',

        headerStyle: {
          textAlign: 'left',
          fontSize: this.props.selectedFontSize,
          fontWeight: 'bold',
        },
      },
    ],
    wholeOrderCoulmns: [
      {
        Header: 'Discount Summary',
        show: true,
        accessor: 'name',
        width: 150,
        headerStyle: {
          textAlign: 'left',
          fontSize: this.props.selectedFontSize,
          fontWeight: 'bold',
        },
      },
      {
        Header: 'Discount Amount',
        show: true,
        accessor: 'amount',
        width: 100,
        headerStyle: {
          textAlign: 'left',
          fontSize: this.props.selectedFontSize,
          fontWeight: 'bold',
        },
      },
    ],
  };

  getcompanyColumns() {
    const { selectedFontSize } = this.props;
    return [
      {
        Header: 'Product',
        accessor: 'product',
        width: 160,
        headerStyle: {
          fontSize: selectedFontSize,
          fontWeight: 'bold',
        },
      },
      // {
      //   Header: 'Type',
      //   accessor: 'type',
      //   width: 60,
      //   headerStyle: {
      //     fontSize: selectedFontSize,
      //     fontWeight: 'bold',
      //   },
      // },
      // {
      //   Header: 'Description',
      //   accessor: 'description'
      // },
      // {
      //   Header: "ID",
      //   accessor: "id",
      //   width:30
      // },
      // {
      //   Header: "Unit",
      //   accessor: "unit",
      //   width:45
      // },
      {
        Header: 'Units',
        accessor: 'numberOfUnit',
        width: 60,
        headerStyle: {
          fontSize: selectedFontSize,
          fontWeight: 'bold',
        },
      },
      {
        Header: 'MSRP',
        accessor: 'msrp',
        width: 70,
        headerStyle: {
          fontSize: selectedFontSize,
          fontWeight: 'bold',
        },
      },
      {
        Header: 'Item Total',
        accessor: 'itemTotal',
        width: 120,
        headerStyle: {
          fontSize: selectedFontSize,
          fontWeight: 'bold',
        },
      },
      {
        Header: 'Discounts',
        accessor: 'discounts',
        width: 190,
        headerStyle: {
          fontSize: selectedFontSize,
          fontWeight: 'bold',
        },
      },
      {
        Header: 'Final MSRP',
        accessor: 'netPrice',
        width: 100,
        headerStyle: {
          fontSize: selectedFontSize,
          fontWeight: 'bold',
        },
      },
      {
        Header: 'Total $',
        accessor: 'total',

        headerStyle: {
          textAlign: 'left',
          fontSize: selectedFontSize,
          fontWeight: 'bold',
        },
      },
    ];
  }

  seedCompanyColumns(seedType) {
    const { purchaseOrder, selectedFontSize } = this.props;
    return [
      {
        Header: capitalize(seedType),
        accessor: 'product',
        width: 155,
        headerStyle: {
          fontSize: selectedFontSize,
          fontWeight: 'bold',
        },
      },
      {
        Header: 'Units',
        accessor: 'unit',
        width: 60,
        headerStyle: {
          fontSize: selectedFontSize,
          fontWeight: 'bold',
        },
      },
      ...(!purchaseOrder.isQuote && {
        Header: 'Seed Size',
        accessor: 'seedSize',
        //width: 100
        headerStyle: {
          fontSize: selectedFontSize,
          fontWeight: 'bold',
        },
      }),
      ...(!purchaseOrder.isQuote && {
        Header: 'Packaging',
        accessor: 'packaging',
        //width: 90
        headerStyle: {
          fontSize: selectedFontSize,
          fontWeight: 'bold',
        },
      }),
      {
        Header: 'MSRP',
        accessor: 'msrp',
        width: 70,
        headerStyle: {
          fontSize: selectedFontSize,
          fontWeight: 'bold',
        },
      },
      {
        Header: 'Item total',
        accessor: 'itemTotal',
        width: 110,
        headerStyle: {
          fontSize: selectedFontSize,
          fontWeight: 'bold',
        },
      },
      {
        Header: 'Discounts',
        accessor: 'discounts',
        width: 90,
        headerStyle: {
          fontSize: selectedFontSize,
          fontWeight: 'bold',
        },
      },
      {
        Header: '',
        accessor: 'discountValues',
        width: 90,
        headerStyle: {
          fontSize: selectedFontSize,
          fontWeight: 'bold',
        },
      },
      {
        Header: 'Final MSRP',
        accessor: 'netPrice',
        width: 100,
        headerStyle: {
          fontSize: selectedFontSize,
          fontWeight: 'bold',
        },
      },
      {
        Header: 'Total $',
        accessor: 'total',

        headerStyle: {
          textAlign: 'left',
          fontSize: selectedFontSize,
          fontWeight: 'bold',
        },
      },
    ];
  }

  getProductDiscountsData() {
    const {
      customerProducts,
      customerCustomProducts,
      purchaseOrder,
      seedCompanies,
      products,
      customProducts,
      dealerDiscounts,
      companies,
      selectedShareholder,
    } = this.props;

    return [...customerProducts, ...customerCustomProducts]
      .filter((cp) => cp.purchaseOrderId === purchaseOrder.id)
      .map((order) => {
        let appliedDiscounts = getAppliedDiscounts(order, dealerDiscounts);
        let product = getProductFromOrder(order, products, customProducts);
        let seedCompany;
        let company;
        if (!product) return null;
        if (order.hasOwnProperty('customProductId')) {
          company = companies.find((c) => c.id === product.companyId);
        } else {
          seedCompany = seedCompanies.find((sc) => sc.id === product.seedCompanyId);
        }
        return {
          discountData: customerProductDiscountsTotals(
            order,
            appliedDiscounts,
            product,
            null,
            null,
            selectedShareholder,
            purchaseOrder,
          ),
          product,
          seedCompany,
          company,
          order,
        };
      });
  }

  /**
   * Return discount / product data grouped by seed type
   */
  get groupedDiscountsData() {
    let productDiscountsData = this.getProductDiscountsData();

    let seedTypeGrouping = { BUSINESS: [] };
    productDiscountsData.forEach((data) => {
      if (data && data.product !== null && data.product.hasOwnProperty('companyId')) {
        seedTypeGrouping['BUSINESS'] = [...seedTypeGrouping['BUSINESS'], data];
      } else {
        if (data.product && seedTypeGrouping[data.product.seedType]) {
          seedTypeGrouping[data.product.seedType] = [...seedTypeGrouping[data.product.seedType], data];
        } else if (data.product) {
          seedTypeGrouping[data.product.seedType] = [data];
        }
      }
    });
    return seedTypeGrouping;
  }

  getPackaging(packagingGroup) {
    return this.props.packagings.find((p) => p.id === packagingGroup.packagingId);
  }

  getSeedSize(packagingGroup) {
    return this.props.seedSizes.find((ss) => ss.id === packagingGroup.seedSizeId);
  }

  getTableDataMonsanto(customerOrders, croptype) {
    let totalDiscount1 = 0;
    let tableData1 = [];
    let preTotal1 = 0;
    let msrp1 = 0;
    let total1 = 0;
    let qty1 = 0;
    const { classes, selectedFontSize } = this.props;
    customerOrders
      .filter((order) => order.orderQty > 0)
      .filter((order) => order.monsantoProductId)
      .filter((order) => order.MonsantoProduct && order.MonsantoProduct.classification == croptype)
      .filter((order) => {
        if (order.MonsantoProduct && order.isDeleted) return null;
        return order;
      })
      .forEach((order) => {
        let preTotal;
        let product;
        let msrp;
        let qty;
        let shareholderPercentage = 0;
        const shareHolder =
          this.props.selectedShareholder &&
          order.shareholderData &&
          order.shareholderData.find((s) => s.shareholderId == this.props.selectedShareholder.id);

        if (this.props.selectedShareholder) {
          if (order.shareholderData) {
            const shareHolder = order.shareholderData.find((s) => s.shareholderId == this.props.selectedShareholder.id);
            if (shareHolder) {
              shareholderPercentage = shareHolder.hasOwnProperty('percentage')
                ? parseFloat(shareHolder.percentage) / 100
                : parseFloat(shareHolder.percentage);
            } else {
              shareholderPercentage = 0;
            }
          }
        }

        if (order.Product) {
          msrp = order.msrpEdited ? order.msrpEdited || 0 : order.Product.msrp || 0;
          preTotal = order.orderQty * parseFloat(msrp !== null ? msrp : 0);
          preTotal = preTotal.toFixed(3);
          product = order.Product;
          qty = order.orderQty;
        } else if (order.CustomProduct) {
          msrp = order.msrpEdited ? order.msrpEdited : order.CustomProduct.costUnit;
          preTotal = order.orderQty * parseFloat(msrp !== null ? msrp : 0);
          preTotal = preTotal.toFixed(3);
          product = order.CustomProduct;
          qty = order.orderQty;
        } else if (order.MonsantoProduct) {
          msrp = order.msrpEdited ? order.msrpEdited : order.price;
          preTotal =
            shareHolder && shareHolder.hasOwnProperty('percentage')
              ? order.orderQty * shareholderPercentage * parseFloat(msrp !== null ? msrp : 0)
              : (order.orderQty - shareholderPercentage) * parseFloat(msrp !== null ? msrp : 0);

          preTotal = preTotal.toFixed(3);
          product = order.MonsantoProduct;
          qty =
            shareHolder && shareHolder.hasOwnProperty('percentage')
              ? order.orderQty * shareholderPercentage
              : order.orderQty - shareholderPercentage;
        }

        const discountsPOJO = order.discounts
          .map((discount) => {
            return this.props.dealerDiscounts.find((dd) => dd.id === discount.DiscountId);
          })
          .filter((el) => el);
        const { discounts, discountAmount } = customerProductDiscountsTotals(
          order,
          discountsPOJO,
          product,
          null,
          null,
          this.props.selectedShareholder,
          this.props.currentPurchaseOrder,
        );

        const DiscountsNameList = () => {
          let ordered = order.discounts
            .sort((a, b) => a.order - b.order)
            .map((discount) => discounts[discount.DiscountId])
            .filter((x) => x);
          return (
            <div className={this.props.classes.discountList}>
              {ordered.map((discount) => (
                // <Tooltip title={discount.dealerDiscount.name}>
                <div className={this.props.classes.discountListItem} key={discount.dealerDiscount.id}>
                  {' '}
                  <span>{discount.dealerDiscount.name.substring(0, 7) + '(' + discount.value + ')'}</span>
                  <span style={{ float: 'right' }}>{numberToDollars(discount.amount)}</span>
                </div>
                // </Tooltip>
              ))}
            </div>
          );
        };
        // const DiscountsSubtotalList = () => {
        //   let ordered = order.discounts
        //     .sort((a, b) => a.order - b.order)
        //     .map((discount) => discounts[discount.DiscountId])
        //     .filter((x) => x);
        //   return (
        //     <div className={this.props.classes.discountList}>
        //       {ordered.map((discount) => (
        //         <div className={this.props.classes.discountListItem} key={discount.dealerDiscount.id}>
        //           {numberToDollars(discount.amount)}
        //         </div>
        //       ))}
        //     </div>
        //   );
        // };

        // const preTotal = isSeedCompany
        //   ? order.orderQty * parseFloat(order.Product.msrp)
        //   : order.orderQty * parseFloat(order.CustomProduct.costUnit);
        // const discountAmount = 0;
        totalDiscount1 += discountAmount;
        preTotal1 += parseFloat(preTotal);
        msrp1 += parseFloat(msrp);
        const total = preTotal - discountAmount;
        total1 += total;
        qty1 += qty;

        qty > 0 &&
          shareHolder !== undefined &&
          tableData1.push({
            qty: qty,
            preTotal: numberToDollars(preTotal),
            msrp: numberToDollars(msrp),
            discountTotal: discountAmount.toFixed(2),
            discountName: <DiscountsNameList />,
            // discountSubtotal: <DiscountsSubtotalList />,
            total: numberToDollars(total.toFixed(2)),
            unitafterdiscount: numberToDollars(total.toFixed(2) / qty),
            Product: product,
            id: order.id,
            order,
          });
      });
    const avgAfterDisc1 = total1 / qty1;
    tableData1.push({
      lastRowHeader: (
        <div>
          <span className={classes.summaryCellTitle}> Total Units </span>
        </div>
      ),
      qty: (
        <div>
          <span> {qty1}</span>
        </div>
      ),
      msrp: (
        <div>
          <span className={classes.summaryCellTitle}> Avg MSRP </span>
          <br />
          <span>
            {isNaN(Number(preTotal1 / qty1).toFixed(2)) ? '' : numberToDollars(Number(preTotal1 / qty1).toFixed(2))}
          </span>
        </div>
      ),
      preTotal: (
        <div>
          <span className={classes.summaryCellTitle}> Total before discount </span>
          <br />
          <span>{isNaN(preTotal1) ? '' : numberToDollars(preTotal1)}</span>
        </div>
      ),
      unitafterdiscount: (
        <div>
          <span className={classes.summaryCellTitle}> Avg MSRP </span>
          <br />
          <span>{isNaN(avgAfterDisc1) ? '' : numberToDollars(avgAfterDisc1)}</span>
        </div>
      ),
      total: (
        <div>
          <span className={classes.summaryCellTitle}> Total after discount </span>
          <br />
          <span>{isNaN(total1) ? '' : numberToDollars(total1)}</span>
        </div>
      ),
    });

    let tableHeaders1 = [
      {
        Header: typesMap[croptype],
        show: true,
        id: 'product',
        width: 155,
        accessor: (d) => d,
        headerStyle: {
          fontSize: selectedFontSize,
          fontWeight: 'bold',
        },
        Cell: (props) => {
          const { classes, seedSizes, packagings } = this.props;
          const order = props.value;
          if (order.lastRowHeader) {
            return order.lastRowHeader;
          }
          if (order.relatedProducts) {
            return order.relatedProducts;
          }
          if (!order.order) {
            return;
          }
          const isMonsantoSeedCompany = order.order.hasOwnProperty('monsantoProductId');
          const isSent = isMonsantoSeedCompany ? order.order.isSent : false;
          const product = order.Product;
          const seedCompany = order.Product.SeedCompany || order.Product.ApiSeedCompany;
          const isSeedCompany = !!seedCompany && !isMonsantoSeedCompany;
          let productFirstLine = '';
          let productSecondLine = '';
          let productSeedType = product.seedType ? product.seedType.toLowerCase() : this.getProductType(product);
          let productCost;
          let productPackagingValue = [];
          if (seedCompany) {
            productFirstLine += `${seedCompany.name} `;
            const metadata = JSON.parse(seedCompany.metadata);
            productFirstLine += metadata[productSeedType] ? metadata[productSeedType].brandName : '';
          }

          if (product.companyId) {
            productFirstLine = product.name;
            productSecondLine = product.description;
            productCost = `UN-${product.costUnit}`;
          } else {
            if (product.blend) productSecondLine += `${product.blend}`;
            if (product.LineItem) {
              if (product.seedSize) {
                productSecondLine += ` ${product.seedSize}`;
              }
            }
            if (product.brand) productSecondLine += ` ${product.brand}`;
            if (product.LineItem) {
              if (product.packaging) productSecondLine += ` ${product.packaging}`;
            }
            if (product.treatment) productSecondLine += ` ${product.treatment}`;

            if (product.LineItem) {
              //Monsanto
              const unit = JSON.parse(product.LineItem.suggestedDealerMeasurementUnitCode).value;
              productCost = `${unit}-${product.LineItem.suggestedDealerPrice}`;
            } else {
              productCost = `MSRP-${product.msrp}`;
            }
          }
          //productPackagingValue
          const productPackaging = product.ProductPackaging;
          if (productPackaging) {
            productPackaging.packagingGroups
              .filter((packagingGroup) => packagingGroup.CustomerProductId === order.id)
              .forEach((packagingGroup, index) => {
                const seedSize = seedSizes.find((_seedSize) => _seedSize.id === packagingGroup.seedSizeId);
                const packaging = packagings.find((_packaging) => _packaging.id === packagingGroup.packagingId);
                // const sp = `${seedSize ? seedSize.name : "-"} / ${
                //   packaging ? packaging.name : "-"
                // }`;
                if (seedSize) {
                  productPackagingValue.push(`Size: ${seedSize.name}`);
                }
                if (packaging) {
                  productPackagingValue.push(`Package: ${packaging.name}`);
                }
                // if (index > 0) productPackagingValue += ";";
                // productPackagingValue = productPackagingValue + sp;
              });
          }
          if (order.order.comment) {
            productPackagingValue.push(`Comment: ${order.order.comment}`);
          }
          let showSeedSource = false;
          if (product.seedType && seedCompany) {
            if (seedCompany.metadata) {
              let metadata = JSON.parse(seedCompany.metadata);
              let st = productSeedType.toLowerCase();
              let matchingKeyIdx = -1;
              let metadataKeys = Object.keys(metadata);
              metadataKeys.forEach((key, idx) => {
                if (key.toLowerCase() === st) matchingKeyIdx = idx;
              });
              if (matchingKeyIdx !== -1) {
                if (metadata[metadataKeys[matchingKeyIdx]].seedSource === true) showSeedSource = true;
              }
            }
          }
          return (
            <div className={classes.productDetailRow}>
              <div>
                {/* <p className={this.props.classes.companyBrand}>{productFirstLine}</p> */}
                {productSecondLine}
                {/* <br /> */}
                {/* {productCost} */}
                {productPackagingValue.length > 0 && (
                  <React.Fragment>
                    <br />
                    {productPackagingValue.join(' | ')}
                  </React.Fragment>
                )}
                {showSeedSource && (
                  <React.Fragment>
                    <br />
                    SeedSource: {`${product.seedSource}`}
                  </React.Fragment>
                )}
                {order.order.relatedCustomProducts &&
                  order.order.relatedCustomProducts
                    .filter((r) => r.orderQty > 0)
                    .map((relatedCustomProduct, index) => (
                      <React.Fragment key={index}>
                        <br />
                        <span style={{ fontSize: 10 }}>
                          Treatment: {relatedCustomProduct.CompanyName}/{relatedCustomProduct.productType}/
                          {relatedCustomProduct.productName}
                          {relatedCustomProduct.orderQty} {relatedCustomProduct.unit} <sup>*</sup>
                        </span>
                      </React.Fragment>
                    ))}
                {/* {isMonsantoSeedCompany && <br />} */}
                {/* {isMonsantoSeedCompany && product.crossReferenceId} */}
                {order.order.farmId ? <br /> : ''}
                {order.order.farmId
                  ? this.props.farms.find((farm) => farm.id === order.order.farmId) &&
                    this.props.farms.find((farm) => farm.id === order.order.farmId).name
                  : ''}
                {order.order.fieldName ? ' / ' + order.order.fieldName : ''}
              </div>
              {/* {this.state.subjectName !== 'Quote' && isMonsantoSeedCompany && !isSent && (
                <Tooltip title="Product haven't synced to Bayer yet">
                  <WarningIcon className={classes.warningIcon} />
                </Tooltip>
              )} */}
            </div>
          );
        },
      },
      {
        Header: 'Units',
        show: true,
        accessor: 'qty',
        width: 50,
        headerStyle: {
          fontSize: selectedFontSize,
          fontWeight: 'bold',
        },
      },
      {
        Header: 'MSRP',
        id: 'msrp',
        show: true,
        width: 70,
        accessor: 'msrp',
        headerStyle: {
          fontSize: selectedFontSize,
          fontWeight: 'bold',
        },
      },
      {
        Header: 'Item total',
        id: 'preTotal',
        show: true,
        width: 110,
        accessor: 'preTotal',
        // accessor: (d) => d,
        // Cell: (props) => {
        //   return numberToDollars(props.value.preTotal);
        // },
        headerStyle: {
          fontSize: selectedFontSize,
          fontWeight: 'bold',
        },
      },
      {
        Header: 'Discounts',
        show: true,
        accessor: 'discountName',
        width: 190,
        headerStyle: {
          fontSize: selectedFontSize,
          fontWeight: 'bold',
        },
      },

      // {
      //   Header: '',
      //   id: 'discountAmount',
      //   show: true,
      //   accessor: 'discountSubtotal',
      //   width: 110,
      //   headerStyle: {
      //     fontSize: selectedFontSize,
      //     fontWeight: 'bold',
      //   },
      // },
      {
        Header: 'Final MSRP',
        // accessor: 'netPrice',
        id: 'unitafterdiscount',
        width: 100,
        accessor: 'unitafterdiscount',
        headerStyle: {
          fontSize: selectedFontSize,
          fontWeight: 'bold',
        },
      },
      {
        Header: 'Total $',
        show: true,
        id: 'total',
        accessor: 'total',

        headerStyle: {
          textAlign: 'left',
          fontSize: selectedFontSize,
          fontWeight: 'bold',
        },
      },
    ];

    return { tableData1, tableHeaders1 };
  }

  seedCompanyTableData(seedCompany, seedType) {
    const {
      seedCompanies,
      // productPackagings,
      // purchaseOrder,
      seedSizes,
      packagings,
      classes,
      farms,
    } = this.props;
    let rows = [];
    let totalUnits = 0;
    let totalItemTotals = 0;
    // eslint-disable-next-line
    let totalNetPrices = 0;
    let total = 0;

    if (isEmpty(this.groupedDiscountsData)) {
      return rows;
    }
    let discountsData = (this.groupedDiscountsData[seedType] || []).filter((d) => d.seedCompany.id === seedCompany.id);

    discountsData
      .sort((a, b) => {
        return a.product.blend.localeCompare(b.product.blend, 'en', {
          sensitivity: 'base',
        });
      })

      .forEach((data) => {
        const {
          order: { relatedCustomProducts },
        } = data;

        // let productPackaging = this.props.productPackagings
        //   .filter(pp => pp.purchaseOrderId === this.props.purchaseOrder.id)
        //   .find(pp => pp.productId === data.product.id);

        if (data.order.orderQty > 0) {
          let shareholderPercentage;
          if (this.props.selectedShareholder) {
            shareholderPercentage = data.discountData.shareholderPercentage;
          } else {
            shareholderPercentage = 0;
          }
          const shareHolder =
            this.props.selectedShareholder &&
            data.order.shareholderData &&
            data.order.shareholderData.find((s) => s.shareholderId == this.props.selectedShareholder.id);
          // if (shareholderPercentage === 0) return null;

          // let seedSizeEl = null;
          // let packagingEl = null;

          // if (productPackaging && productPackaging.packagingGroups && productPackaging.packagingGroups.length) {
          //   seedSizeEl = (
          //     <React.Fragment>
          //       {productPackaging.packagingGroups.map((packagingGroup, idx) => (
          //         <React.Fragment key={`SS${packagingGroup.seedSizeId}${idx}`}>
          //           <span>{this.getSeedSize(packagingGroup).name}</span>
          //         </React.Fragment>
          //       ))}
          //     </React.Fragment>
          //   );

          //   packagingEl = (
          //     <React.Fragment>
          //       {productPackaging.packagingGroups.map((packagingGroup, idx) => (
          //         <React.Fragment key={`PKG${packagingGroup.packagingId}${idx}`}>
          //           <span>
          //             {this.getPackaging(packagingGroup).name}
          //             {/* {this.getPackaging(packagingGroup).quantity} */}
          //           </span>
          //         </React.Fragment>
          //       ))}
          //     </React.Fragment>
          //   );
          // }

          let orderedDiscounts = data.order.discounts
            .sort((a, b) => a.order - b.order)
            .map((discount) => data.discountData.discounts[discount.DiscountId])
            .filter((x) => x);

          let discountsEl = (
            <div>
              {orderedDiscounts.map((discount) => (
                <span key={discount.dealerDiscount.id} className={classes.discount} id={discount.dealerDiscount.id}>
                  {discount.dealerDiscount.name + '  (' + discount.value + ')'}
                </span>
              ))}
            </div>
          );

          let discountsValueEl = (
            <div>
              {orderedDiscounts.map((discount) => (
                <span key={`${discount.dealerDiscount.id}-value`} className={classes.discount}>
                  {numberToDollars(discount.amount)}
                </span>
              ))}
            </div>
          );
          let units = parseFloat(data.order.orderQty) - shareholderPercentage;
          totalUnits += units;
          totalItemTotals += data.discountData.originalPrice;
          const netPrice = units === 0 ? units : (data.discountData.total / units).toFixed(2);

          totalNetPrices += parseFloat(netPrice);

          total += data.discountData.total;

          // rows.push({
          //   product: getProductName(data.product, seedCompanies),
          //   unit: units,
          //   seedSize: seedSizeEl,
          //   packaging: packagingEl,
          // });

          // !purchaseOrder.isQuote && rows.push({
          //   seedSize: seedSizeEl,
          //   packaging: packagingEl,
          // });
          let productFarmInfo = '';
          if (data.order.farmId) {
            const farm = farms.find((farm) => farm.id === data.order.farmId);
            productFarmInfo = farm.name + '/' + data.order.fieldName;
          }
          if (!data.order.Product) return;
          let productPackagingValue = [];
          const productPackaging = data.order.Product.ProductPackaging;
          if (productPackaging) {
            productPackaging.packagingGroups.forEach((packagingGroup, index) => {
              if (packagingGroup.CustomerProductId !== data.order.id) return;
              const seedSize = seedSizes.find((_seedSize) => _seedSize.id === packagingGroup.seedSizeId);
              const packaging = packagings.find((_packaging) => _packaging.id === packagingGroup.packagingId);
              // const sp = `${seedSize ? seedSize.name : "-"} / ${
              //   packaging ? packaging.name : "-"
              // }`;
              // if (index > 0) productPackagingValue += ";";
              // productPackagingValue = productPackagingValue + sp;
              if (seedSize) {
                productPackagingValue.push(`Size: ${seedSize.name}`);
              }
              if (packaging) {
                productPackagingValue.push(`Package: ${packaging.name}`);
              }
            });
          }
          if (data.order.comment) {
            productPackagingValue.push(`Comment: ${data.order.comment}`);
          }
          // const purchaseOrderProduct = purchaseOrder.CustomerProducts.
          let productName = (
            <div>
              {productFarmInfo !== '' && (
                <React.Fragment>
                  {productFarmInfo}
                  <br />
                </React.Fragment>
              )}
              {getProductName(data.product, seedCompanies)}
              {productPackagingValue.length > 0 && (
                <React.Fragment>
                  <br />
                  {productPackagingValue.join(' | ')}
                </React.Fragment>
              )}
              {/* {seedSizeEl && <span>
          &nbsp;/ {seedSizeEl}
        </span>}
        {packagingEl && <span>
          &nbsp;/ {packagingEl}
        </span>} */}
            </div>
          );
          units > 0 &&
            shareHolder !== undefined &&
            rows.push({
              product: productName,
              unit: units,
              msrp: numberToDollars(data.order.msrpEdited || data.product.msrp || data.product.costUnit),
              itemTotal: numberToDollars(data.discountData.originalPrice),
              discounts: discountsEl,
              discountValues: discountsValueEl,
              netPrice: numberToDollars(netPrice),
              total: numberToDollars(data.discountData.total),
            });
          relatedCustomProducts &&
            relatedCustomProducts.length > 0 &&
            rows.push({
              product: (
                <div>
                  {relatedCustomProducts
                    .filter((r) => r.orderQty > 0)
                    .map((relatedCustomProduct, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && <br />}
                        <span style={{ whiteSpace: 'nowrap', fontSize: 10 }}>
                          Treatment: {relatedCustomProduct.CompanyName} {relatedCustomProduct.orderQty}{' '}
                          {relatedCustomProduct.unit} <sup>*</sup>
                        </span>
                      </React.Fragment>
                    ))}
                </div>
              ),
            });
        }
      });

    const avgMsrp = totalItemTotals / totalUnits;
    const avgNetPrice = total / totalUnits;

    rows.push({
      product: (
        <div>
          <span className={classes.summaryCellTitle}> Total Units </span>
        </div>
      ),
      unit: (
        <div>
          <span> {totalUnits}</span>
        </div>
      ),
      msrp: (
        <div>
          <span className={classes.summaryCellTitle}> Avg MSRP </span>
          <br />
          <span>{isNaN(avgMsrp) ? '' : numberToDollars(avgMsrp)}</span>
        </div>
      ),
      itemTotal: (
        <div>
          <span className={classes.summaryCellTitle}> Total before discount </span>
          <br />
          <span>{isNaN(totalItemTotals) ? '' : numberToDollars(totalItemTotals)}</span>
        </div>
      ),
      netPrice: (
        <div>
          <span className={classes.summaryCellTitle}> Avg MSRP </span>
          <br />
          <span>{isNaN(avgNetPrice) ? '' : numberToDollars(avgNetPrice)}</span>
        </div>
      ),
      total: (
        <div>
          <span className={classes.summaryCellTitle}> Total after discount </span>
          <br />
          <span>{isNaN(avgMsrp) ? '' : numberToDollars(total)}</span>
        </div>
      ),
    });
    return rows;
  }

  seedCompanyTable(seedCompany, seedType) {
    const tableData = this.seedCompanyTableData(seedCompany, seedType);
    const { selectedFontSize } = this.props;
    if (tableData.length < 2) return null;
    const customProps = { id: 'breakDownTable-seed' };

    return (
      <div
        className="invoice-table-wrapper"
        style={{ padding: '8px', borderBottom: '2px solid #80808096' }}
        id="breakDownTable-seed/border"
      >
        <React.Fragment key={`${seedType}${seedCompany.id}`}>
          <h4 style={{ color: '#008000', fontSize: '14px' }} id="breakDownTable-seed/text">
            {seedType}
          </h4>

          <ReactTable
            sortable={true}
            showPagination={false}
            getProps={() => customProps}
            resizable={false}
            minRows={1}
            columns={this.seedCompanyColumns(seedType)}
            data={tableData}
            className={`${this.props.classes.breakdownTable} no-white-space BreakDownTable`}
            getTheadTrProps={() => {
              return {
                style: {
                  color: 'black',
                  // background: '#CDDFC8',
                  fontWeight: 'bold',
                },
              };
            }}
            getTrProps={(state, rowInfo) => {
              let style = { fontSize: selectedFontSize };
              if (rowInfo.index === state.resolvedData.length - 1) {
                style = {
                  ...style,
                  color: 'black',
                  fontWeight: 'bold',
                  borderTop: '1px solid #00000024',
                  height: '50px',
                };
              }
              return { style };
            }}
          />
          {/*   <span style={{ fontSize: '10px' }}>
            <sup>*</sup> The prices for these additional products are in a separate table
          </span>*/}
        </React.Fragment>
      </div>
    );
  }

  companyTableData(company) {
    const { classes } = this.props;
    let totalNumberOfUnits = 0.0;
    let totalItemTotals = 0.0;
    // eslint-disable-next-line
    let total = 0.0;

    let rows = [];
    if (isEmpty(this.groupedDiscountsData)) return rows;
    let discountsData = this.groupedDiscountsData['BUSINESS'].filter((d) => d.company.id === company.id);

    discountsData.forEach((data) => {
      if (parseFloat(data.order.orderQty) < 0) return;
      let shareholderPercentage = 0;
      const shareHolder = data.order.shareholderData.find((s) => s.shareholderId == this.props.selectedShareholder.id);
      if (this.props.selectedShareholder) {
        if (data.order.shareholderData) {
          const shareHolder = data.order.shareholderData.find(
            (s) => s.shareholderId == this.props.selectedShareholder.id,
          );
          if (shareHolder) {
            shareholderPercentage = parseFloat(shareHolder.percentage);
          }
        }
      }

      let numberOfUnit = parseFloat(data.order.orderQty - shareholderPercentage).toFixed(2);
      totalNumberOfUnits += parseFloat(numberOfUnit);
      let discountsEl = (
        <div>
          {Object.keys(data.discountData.discounts).map((discountId) => (
            <div key={discountId}>
              <span className={classes.discountName}>
                {data.discountData.discounts[discountId].dealerDiscount.name + '  '}
              </span>
              <span>{numberToDollars(data.discountData.discounts[discountId].amount)}</span>
            </div>
          ))}
        </div>
      );

      let netPrice = 0;
      if (data.discountData.total && (data.order.msrpEdited || data.product.msrp || data.product.costUnit)) {
        netPrice = (data.discountData.total / numberOfUnit).toFixed(2);
      }
      let itemTotal = (parseFloat(data.order.msrpEdited) || data.product.msrp || data.product.costUnit) * numberOfUnit;
      totalItemTotals += itemTotal;
      total += data.discountData.total;
      const productCell = (
        <React.Fragment>
          {data.product.type}/{data.product.name}
          <br />
          {data.order.comment && <React.Fragment>Comment: {data.order.comment}</React.Fragment>}
        </React.Fragment>
      );

      if (data.discountData.total) {
        // shareHolder !== undefined &&
        rows.push({
          productName: `${company.name}-${data.product.type}-${data.product.name}`,
          product: productCell,
          type: data.product.type,
          description: data.product.description,
          id: data.product.customId,
          unit: data.product.unit,
          numberOfUnit: parseFloat(numberOfUnit).toFixed(2),
          msrp: numberToDollars(parseFloat(data.order.msrpEdited) || data.product.msrp || data.product.costUnit),
          itemTotal: numberToDollars(itemTotal),
          discounts: discountsEl,
          netPrice: numberToDollars(netPrice),
          total: numberToDollars(data.discountData.total),
        });
      }
    });
    const avgMsrp = totalItemTotals / totalNumberOfUnits;
    //const avgNetPrice = total / totalNumberOfUnits;

    rows.push({
      product: (
        <div>
          <span className={classes.summaryCellTitle}> Total Units </span>
        </div>
      ),
      numberOfUnit: (
        <div>
          <span> {totalNumberOfUnits.toFixed(2)}</span>
        </div>
      ),
      itemTotal: (
        <div>
          <span className={classes.summaryCellTitle}> Total before discount </span>
          <br />
          <span>{isNaN(totalItemTotals) ? '' : numberToDollars(totalItemTotals)}</span>
        </div>
      ),
      total: (
        <div>
          <span className={classes.summaryCellTitle}> Total after discount </span>
          <br />
          <span>{isNaN(avgMsrp) ? '' : numberToDollars(total)}</span>
        </div>
      ),
    });

    return rows;
  }

  companyTable(company) {
    let tableData = this.companyTableData(company);

    const { selectedFontSize } = this.props;
    if (tableData.length < 2) return null;
    const customProps = { id: 'breakDownTable-Company' };

    return (
      <div
        className="invoice-table-wrapper"
        key={company.id}
        style={{ borderBottom: '2px solid #80808096', padding: '8px' }}
        id="breakDownTable-Company/border"
      >
        <h4 style={{ color: '#008000', fontSize: '14px' }} id="breakDownTable-Company/text">
          {company.name}
        </h4>

        <React.Fragment key={`COMPANY${company.id}`}>
          <ReactTable
            sortable={true}
            showPagination={false}
            resizable={false}
            getProps={() => customProps}
            minRows={1}
            columns={this.getcompanyColumns()}
            data={sortBy(tableData, (o) => o.productName)}
            className={`${this.props.classes.breakdownTable} no-white-space BreakDownTable`}
            getTheadTrProps={() => {
              return {
                style: {
                  // color: '#3C4858',
                  // background: '#CDDFC8',
                  fontWeight: 'bold',
                  color: 'black',
                },
              };
            }}
            getTrProps={(state, rowInfo) => {
              let style = { fontSize: selectedFontSize };
              if (rowInfo.index === state.resolvedData.length - 1) {
                style = {
                  ...style, // background: 'green',
                  color: 'black',
                  fontWeight: 'bold',
                  borderTop: '1px solid #00000024',
                  height: '50px',
                };
              }
              return { style };
            }}
          />
        </React.Fragment>
      </div>
    );
  }

  checkDataExist() {
    const { seedCompanies, companies, currentPurchaseOrder } = this.props;
    let data = 0;
    seedCompanies.forEach((seedCompany) => {
      const metadata = JSON.parse(seedCompany.metadata);
      const cropTypes = Object.keys(metadata);
      cropTypes.forEach((seedType) => {
        let tableData = this.seedCompanyTableData(seedCompany, seedType.toUpperCase());
        if (tableData.length > 1) {
          data++;
        }
      });
    });
    companies.forEach((company) => {
      let tableData = this.companyTableData(company);
      if (tableData.length > 1) {
        data++;
      }
    });
    cropTypesMonsanto.map((croptype) => {
      const { tableData1 } = this.getTableDataMonsanto(currentPurchaseOrder.CustomerMonsantoProducts, croptype);
      if (tableData1.length > 1) {
        data++;
      }
    });
    return data > 0;
  }

  getProductType(product) {
    return typesMap[product.classification];
  }

  render() {
    const { seedCompanies, companies, currentPurchaseOrder, selectedFontSize, showHideCheckBox } = this.props;
    const isHide = document.getElementById('breakDown-checkBox')
      ? document.getElementById('breakDown-checkBox').checked
      : true;
    return (
      <div
        id="breakDown-border"
        className={!isHide ? `${this.props.classes.breakContainer} hide-print` : this.props.classes.breakContainer}
      >
        <div className={'invoice-table-wrapper'}>
          <div
            className="invoice-table-wrapper"
            style={{
              borderBottom: '1px solid black',
              background: '#9e9e9e8f',
              height: '50px',
            }}
          >
            <div style={{ padding: '8px', height: '50px' }} className="ReactTable" id="breakDown-check">
              <span className={this.props.classes.breakSummary}>Order Breakdown</span>
            </div>
          </div>

          <div id="breakDown-Section">
            {seedCompanies.map((seedCompany) => {
              const metadata = JSON.parse(seedCompany.metadata);
              const cropTypes = Object.keys(metadata);

              return (
                <div key={seedCompany.id}>
                  {cropTypes.map((seedType) => this.seedCompanyTable(seedCompany, seedType.toUpperCase()))}
                </div>
              );
            })}

            {cropTypesMonsanto.map((croptype) => {
              const { tableData1, tableHeaders1 } = this.getTableDataMonsanto(
                currentPurchaseOrder.CustomerMonsantoProducts,
                croptype,
              );

              const customProps = { id: `breakDownTable-${croptype}` };

              return (
                <div>
                  {tableData1.length > 1 ? (
                    <div
                      key={croptype}
                      style={{
                        // marginBottom: '10px',
                        marginTop: '10px',
                        padding: '8px',
                        borderBottom: '2px solid #80808096',
                      }}
                      className="invoice-table-wrapper"
                      id={`breakDownTable-${croptype}/border`}
                    >
                      <h4 style={{ color: '#008000', fontSize: '14px' }} id={`breakDownTable-${croptype}/text`}>
                        Bayer / {typesMap[croptype]}
                      </h4>

                      <ReactTable
                        sortable={true}
                        showPagination={false}
                        data={sortBy(
                          tableData1,
                          (o) =>
                            o.Product &&
                            (o.Product.productDetail ? o.Product.productDetail : o.Product.blend + o.Product.brand),
                        )}
                        columns={tableHeaders1}
                        getProps={() => customProps}
                        minRows={1}
                        resizable={false}
                        pageSize={tableData1.length || 0}
                        className={`${this.props.classes.breakdownTable} no-white-space BreakDownTable`}
                        getTheadTrProps={() => {
                          return {
                            style: {
                              color: 'black',

                              // color: '#3C4858',
                              // background: '#CDDFC8',
                              fontWeight: 'bold',
                            },
                          };
                        }}
                        getTrProps={(state, rowInfo) => {
                          let style = { fontSize: selectedFontSize };
                          if (rowInfo.index === state.resolvedData.length - 1) {
                            style = {
                              ...style,
                              color: 'black',
                              fontWeight: 'bold',
                              borderTop: '1px solid #00000024',
                              height: '50px',
                            };
                          }
                          return { style };
                        }}
                      />
                      {/*   <span style={{ fontSize: '10px' }}>
                        <sup>*</sup> The prices for these additional products are in a separate table
                      </span>*/}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              );
            })}

            {companies.map((company) => this.companyTable(company))}
          </div>
        </div>
      </div>
    );
  }
}

InvoiceBreakdown.propTypes = {
  customerProducts: PropTypes.array.isRequired,
  customerCustomProducts: PropTypes.array.isRequired,
  purchaseOrder: PropTypes.object.isRequired,
  seedCompanies: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  customProducts: PropTypes.array.isRequired,
  dealerDiscounts: PropTypes.array.isRequired,
  companies: PropTypes.array.isRequired,
  productPackagings: PropTypes.array.isRequired,
  seedSizes: PropTypes.array.isRequired,
  packagings: PropTypes.array.isRequired,
};

export default withStyles(breakDownStyles)(InvoiceBreakdown);
