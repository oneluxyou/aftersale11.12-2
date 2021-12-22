import { Form, Row, Col, Input, Button, Select, DatePicker, InputNumber, Card, Table, message, Space, Modal, Tooltip } from 'antd';
import { DownOutlined, UpOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import request from 'umi-request';
import SkuInputDemo from './components/FormatInput'
import OfflineData from './components/skuModel';
// import OfflineData from './components/skuModel'
const SkuTotal = () => {
    const [form] = Form.useForm();
    const [dataT, setdataT] = useState([]) as any;
    const [dataE, setdataE] = useState([]) as any;
    const [sku, setsku] = useState() as any;
    const [skuName, setskuName] = useState() as any;
    const [lineData, setlineData] = useState() as any;
    const [expand, setExpand] = useState(false);
    const attribute_value: string[] = ['成本单价', '销量', '平均售价', '销售额', '推广费', '损耗', '毛利润', '净毛利润']
    const attribute_per: string[] = ['成本占比', '损耗占比', '推广占比', '毛利润率', '净毛利润率', '销量贡献率', '销售额贡献率', '推广费贡献率', '售后贡献率', '净毛利贡献率']
    const total_attribute = ['sku', '品名'].concat(attribute_value).concat(attribute_per).concat(['运营', '运维'])
    let first_data_temp: string | any[] = [];
    const [first_data, setfirst_data] = useState() as any;
    // 表格列选择
    const [selectedRowKeys, setselectedRowKeys] = useState() as any;
    const onSelectChange = (value: any) => {
        setselectedRowKeys(value);
        if (value.length == 0) {
            setdataE(dataT);
        } else {
            const temp_dataE: any[] = []
            dataT.forEach((element: any) => {
                if (value.indexOf(element.key) != -1) {
                    temp_dataE.push(element);
                }
            });
            setdataE(temp_dataE);
            console.log(temp_dataE);
        }
    };

    const rowSelection = {
        selectedRowKeys,
        columnWidth: 50,
        onChange: onSelectChange,
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
        ],
    };
    // 弹窗设置
    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleOk = () => {
        setIsModalVisible(false);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const getFields = () => {
        const children = [
            <Col span={5} key={1}>
                <Form.Item
                    name={`店铺`}
                    label={`店铺`}
                    rules={[
                        {
                            required: true,
                            message: '请输入店铺!',
                        },
                    ]}
                >
                    <Select options={[
                        { label: '赫曼', value: '赫曼' },
                        { label: '信盒', value: '信盒' },
                        { label: '宫本', value: '宫本' },
                        { label: '森月', value: '森月' },
                        { label: '维禄', value: '维禄' },
                        // { label: '简砾', value: '简砾' },
                        // { label: '哒唛旺', value: '哒唛旺' },
                        { label: 'Ebay', value: 'Ebay' },
                        { label: 'Walmart', value: 'Walmart' },
                        { label: 'u', value: 'u' },
                        { label: '尚铭', value: '尚铭' },
                        { label: '9店铺总', value: '9店铺总' },
                    ]}
                        placeholder="请输入店铺"
                    />

                </Form.Item>
            </Col>,
            <Col span={6} key={2}>
                <Form.Item
                    name={`开始时间`}
                    label={`开始时间`}
                >
                    <DatePicker />
                </Form.Item>
            </Col>,
            <Col span={6} key={3}>
                <Form.Item
                    name={`结束时间`}
                    label={`结束时间`}
                >
                    <DatePicker />
                </Form.Item>
            </Col>,
            <Col span={7} key={4}>
                <SkuInputDemo />
            </Col>,
        ];
        let i;
        if (expand) {
            for (i = 0; i < attribute_value.length; i++) {
                if (i == 0) {
                    children.push(
                        <Col span={24} style={{ marginBottom: 10, marginTop: -10 }} key={"tip1"}><strong>数值</strong></Col>
                    )
                }
                children.push(
                    <Col span={6} key={attribute_value[i]}>
                        <Form.Item
                            label={attribute_value[i]}
                        >
                            <Input.Group compact>
                                <Form.Item
                                    name={[attribute_value[i], '符号']}
                                    noStyle
                                >

                                    <Select options={[
                                        { label: '≥', value: '大于' },
                                        { label: '≤', value: '小于' },
                                    ]}
                                        defaultValue="大于"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name={[attribute_value[i], '数值']}
                                    noStyle
                                >
                                    <InputNumber
                                        style={{ width: 55 }}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                            </Input.Group>
                        </Form.Item>
                    </Col >,
                )
            }
            for (i = 0; i < attribute_per.length; i++) {
                if (i == 0) {
                    children.push(
                        <Col span={24} style={{ marginBottom: 10, marginTop: -10 }} key={"tip2"}><strong>百分比</strong></Col>
                    )
                }
                children.push(
                    <Col span={6} key={i + attribute_value.length}>
                        <Form.Item
                            label={attribute_per[i]}
                        >
                            <Input.Group compact>
                                <Form.Item
                                    name={[attribute_per[i], '符号']}
                                    noStyle
                                >

                                    <Select options={[
                                        { label: '≥', value: '大于' },
                                        { label: '≤', value: '小于' },
                                    ]}
                                        defaultValue="大于"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name={[attribute_per[i], '数值']}
                                    noStyle
                                >

                                    <InputNumber
                                        style={{ width: 55 }}
                                        formatter={value => `${value}%`}
                                    />
                                </Form.Item>
                            </Input.Group>
                        </Form.Item>
                    </Col >,
                )
            }
        }

        return children;
    };


    const temp_columns = [{
        title: () => (
            <span>
                sku
                <Tooltip
                    title={'公司sku'}
                >
                    <QuestionCircleOutlined />
                </Tooltip>
            </span>
        ),
        dataIndex: 'sku',
        render: (text: string, record: { 品名: any; }) => <a type="link"
            onClick={async () => {
                setsku(text);
                setskuName(record.品名);
                const result = request(`/sku/sale/item/info`, {
                    method: 'POST',
                    data: { 'sku': text },
                    requestType: 'form',
                });
                if (await result) {
                    setlineData(await result);
                    first_data_temp = []
                    for (const iterator of eval(await result)) {
                        if ((iterator.type == "销售总数/天/PC") || (iterator.type == "七天日销")) {
                            first_data_temp.push(iterator);
                        }
                    }
                    setfirst_data(first_data_temp)
                    setIsModalVisible(true);
                } else {
                    message.error('提交失败');
                }
            }
            }
        >
            {text}</a>,
        fixed: 'left',
        width: 150,
    },
    {
        title: '品名',
        dataIndex: '品名',
        fixed: 'left',
        width: 180,
    },
    {
        title: '成本单价',
        dataIndex: '成本单价',
        render: (text: number) => <span>{text.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>,
        width: 100,
    },
    {
        title: '销量',
        dataIndex: '销量',
        sorter: (a: { 销量: number; }, b: { 销量: number; }) => a.销量 - b.销量,
        width: 100,
    },
    {
        title: '平均售价',
        dataIndex: '平均售价',
        sorter: (a: { 平均售价: number; }, b: { 平均售价: number; }) => a.平均售价 - b.平均售价,
        render: (text: number) => <span>{text.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>,
        width: 100,
    },
    {
        title: '销售额',
        dataIndex: '销售额',
        sorter: (a: { 销售额: number; }, b: { 销售额: number; }) => a.销售额 - b.销售额,
        render: (text: number) => <span>{text.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>,
        width: 100,
    },
    {
        title: '推广费',
        dataIndex: '推广费',
        render: (text: number) => <span> {text.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>,
        width: 100,
    },
    {
        title: '损耗',
        dataIndex: '损耗',
        render: (text: number) => <span>{text.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>,
        width: 100,
    },
    {
        title: () => (
            <span>
                毛利润
                <Tooltip
                    title={'=0.85 * 销售额 - 销售总成本'}
                >
                    <QuestionCircleOutlined />
                </Tooltip>
            </span>
        ),
        dataIndex: '毛利润',
        render: (text: number) => <span>{text.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>,
        width: 100,
    },
    {
        title: () => (
            <span>
                净毛利润
                <Tooltip
                    title={'=0.85*销售额 - 销售总成本 - 推广费-售后'}
                >
                    <QuestionCircleOutlined />
                </Tooltip>
            </span>
        ),
        dataIndex: '净毛利润',
        tooltip: '=0.85 * 销售额 - 销售总成本 - 推广费 - 售后',
        render: (text: number) => <span>{text.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>,
        width: 110,
    },
    {
        title: () => (
            <span>
                成本占比(%)
                <Tooltip
                    title={'=销售总成本/销售额'}
                >
                    <QuestionCircleOutlined />
                </Tooltip>
            </span>
        ),
        dataIndex: '成本占比',
        render: (text: number) => <span>{text.toFixed(4).toString()}%</span>,
        width: 125,
    },
    {
        title: () => (
            <span>
                损耗占比(%)
                <Tooltip
                    title={'=售后 / 销售额'}
                >
                    <QuestionCircleOutlined />
                </Tooltip>
            </span>
        ),
        dataIndex: '损耗占比',
        render: (text: number) => <span>{text.toFixed(4).toString()}%</span>,
        width: 125,
    },
    {
        title: () => (
            <span>
                推广占比(%)
                <Tooltip
                    title={'=推广费 / 销售额'}
                >
                    <QuestionCircleOutlined />
                </Tooltip>
            </span>
        ),
        dataIndex: '推广占比',
        render: (text: number) => <span>{text.toFixed(4).toString()}%</span>,
        width: 125,
    },
    {
        title: () => (
            <span>
                毛利润率(%)
                <Tooltip
                    title={'=毛利润率 / 销售额'}
                >
                    <QuestionCircleOutlined />
                </Tooltip>
            </span>
        ),
        dataIndex: '毛利润率',
        render: (text: number) => <span>{text.toFixed(4).toString()}%</span>,
        width: 135,
    },
    {
        title: () => (
            <span>
                净毛利润率(%)
                <Tooltip
                    title={'=净毛利润率 / 销售额'}
                >
                    <QuestionCircleOutlined />
                </Tooltip>
            </span>
        ),
        dataIndex: '净毛利润率',
        render: (text: number) => <span>{text.toFixed(4).toString()}%</span>,
        width: 145,
    },
    {
        title: () => (
            <span>
                销量贡献值(%)
                <Tooltip
                    title={'=销量 / 所有sku销量'}
                >
                    <QuestionCircleOutlined />
                </Tooltip>
            </span>
        ),
        dataIndex: '销量贡献率',
        render: (text: number) => <span>{text.toFixed(4).toString()}%</span>,
        width: 145,
    },
    {
        title: () => (
            <span>
                销售额贡献值(%)
                <Tooltip
                    title={'=销售额 / 所有sku销售额'}
                >
                    <QuestionCircleOutlined />
                </Tooltip>
            </span>
        ),
        dataIndex: '销售额贡献率',
        render: (text: number) => <span>{text.toFixed(4).toString()}%</span>,
        width: 150,
    },
    {
        title: () => (
            <span>
                推广费贡献值(%)
                <Tooltip
                    title={'=推广费 / 所有sku推广费'}
                >
                    <QuestionCircleOutlined />
                </Tooltip>
            </span>
        ),
        dataIndex: '推广费贡献率',
        render: (text: number) => <span>{text.toFixed(4).toString()}%</span>,
        width: 150,
    },
    {
        title: () => (
            <span>
                售后贡献值(%)
                <Tooltip
                    title={'=售后 / 所有sku售后'}
                >
                    <QuestionCircleOutlined />
                </Tooltip>
            </span>
        ),
        dataIndex: '售后贡献率',
        render: (text: number) => <span>{text.toFixed(4).toString()}%</span>,
        width: 145,
    },
    {
        title: () => (
            <span>
                净毛利贡献值(%)
                <Tooltip
                    title={'=净毛利 / 所有sku净毛利'}
                >
                    <QuestionCircleOutlined />
                </Tooltip>
            </span>
        ),
        dataIndex: '净毛利贡献率',
        render: (text: number) => <span>{text.toFixed(4).toString()}%</span>,
        width: 150,
    },
    {
        title: '运营',
        dataIndex: '运营',
        width: 100,
    }, {
        title: '运维',
        dataIndex: '运维',
        width: 100,
    }
    ];
    const [columns, setcolumns] = useState(temp_columns) as any;
    const [attribute, setattribute] = useState(total_attribute) as any;
    const onFinish = async (values: any) => {
        console.log(values);
        if (values['开始时间'] != null) {
            values['开始时间'] = values['开始时间'].format("YYYY-MM-DD");
        }
        if (values['结束时间'] != null) {
            values['结束时间'] = values['结束时间'].format("YYYY-MM-DD");
        }
        const result = request(`/sku/sale/total`, {
            method: 'POST',
            data: { ...values },
            requestType: 'form',
        });
        if (await result) {
            if (await result != 'false') {
                message.success('提交成功');
                setdataT(await result);
                setdataE(await result);
            }
            else {
                message.error('无对应sku信息');
            }
        }
        else {
            message.error('提交失败');
        }

    };
    // 列筛选器改变事件
    function ColChange(i: any) {
        if (`${i}` == '') {
            setcolumns(temp_columns);
            setattribute(total_attribute);
        }
        else {
            const col_array = `${i}`.split(',')
            setattribute(col_array);
            setcolumns(col_array.map((value) => {
                return temp_columns[total_attribute.indexOf(value)];
            }))
        }
    }
    // 列筛选器选项
    const Option = total_attribute.map((value: any) => {
        return { label: value, value: value };
    })
    // 导出报表
    const downloadExcel = () => {
        const excel_datas = dataE;
        // 列标题，逗号隔开，每一个逗号就是隔开一个单元格
        let str = attribute.join(",") + '\n';
        // 增加\t为了不让表格显示科学计数法或者其他格式
        for (let i = 0; i < excel_datas.length; i++) {
            for (const key in attribute) {
                if (Object.prototype.hasOwnProperty.call(excel_datas[i], attribute[key])) {
                    str += `${excel_datas[i][attribute[key]] + '\t'},`;
                }
            }
            str += '\n';
        }
        // encodeURIComponent解决中文乱码
        const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
        // 通过创建a标签实现
        const link = document.createElement('a');
        link.href = uri;
        // 对下载的文件命名
        link.download = 'sku对应信息表.csv';
        link.click();
    };
    return (
        <>
            <Card>
                <Form
                    form={form}
                    name="advanced_search"
                    className="ant-advanced-search-form"
                    onFinish={onFinish}
                >
                    <Row gutter={24}>
                        {getFields()}
                    </Row>
                    <Col
                        span={24}
                        style={{
                            textAlign: 'center',
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            查询
                        </Button>
                        <Button
                            style={{
                                margin: '0 8px',
                            }}
                            onClick={() => {
                                form.resetFields();
                                setdataT([]);
                                setdataE([]);
                            }}
                        >
                            重置
                        </Button>
                        <a
                            style={{ fontSize: 12 }}
                            onClick={() => {
                                setExpand(!expand);
                            }}
                        >
                            {expand ? <UpOutlined /> : <DownOutlined />} 高级搜索
                        </a>
                    </Col>

                </Form>
            </Card>
            <Card>
                <Row style={{ marginBottom: 5 }}>
                    <Col span={12}>
                        <span>列选择器：</span>
                        <Select style={{ width: 500 }} mode="multiple" defaultValue={['sku', '品名']} options={Option} onChange={ColChange} />

                    </Col>
                    <Col
                        span={12}
                        style={{
                            textAlign: 'right',
                            float: 'right'
                        }}>
                        <Space>
                            <Button type="primary" onClick={() => downloadExcel()}>导出Excel表格</Button>
                        </Space>
                    </Col>
                </Row>
                <Table
                    columns={columns}
                    scroll={{ x: 900, y: 500 }}
                    dataSource={dataT}
                    rowSelection={rowSelection}
                    pagination={{
                        defaultPageSize: 10,
                        pageSizeOptions: ["10", "20", "50", "100"],
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => {
                            return `总共 ${total} 条数据`
                        }
                    }}
                />
            </Card>
            <Modal title={<span>{sku}的具体数据: <br /> {skuName} </span>} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={1200}>
                <OfflineData
                    offlineData={eval(lineData)}
                    firstData={first_data}
                />
            </Modal>
        </>
    );
};

export default SkuTotal;