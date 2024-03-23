import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Pagination, Row } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import http_common from "../../http_common.ts";
import CategoryCard from "./CategoryCard.tsx";
import { ICategorySearch, IGetCategories } from "./types.ts";

const CategoryListPage = () => {
    const [data, setData] = useState<IGetCategories>({
        content: [],
        totalPages: 0,
        totalElements: 0,
        number: 0
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const [formParams, setFormParams] = useState<ICategorySearch>({
        name: searchParams.get('name') || "",
        page: Number(searchParams.get('page')) || 1,
        size: Number(searchParams.get('size')) || 2
    });
    const [form] = Form.useForm<ICategorySearch>();

    useEffect(() => {
        fetchCategories();
    }, [formParams]);

    const fetchCategories = async () => {
        try {
            const response = await http_common.get<IGetCategories>("/api/categories/search", {
                params: { ...formParams, page: formParams.page - 1 }
            });
            setData(response.data);
            form.setFieldsValue(formParams);
            updateURLSearchParams(formParams);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await http_common.delete(`/api/categories/${id}`);
            setData(prevData => ({
                ...prevData,
                content: prevData.content.filter(item => item.id !== id)
            }));
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    const handlePageChange = (page: number, pageSize: number | undefined) => {
        setFormParams({ ...formParams, page, size: pageSize || 2 });
    };

    const updateURLSearchParams = (params: ICategorySearch) => {
        const newSearchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                newSearchParams.append(key, String(value));
            }
        });
        setSearchParams(newSearchParams);
    };

    return (
        <div>
            <h1>Список категорий</h1>
            <Link to="/category/create">
                <Button size="large">Добавить</Button>
            </Link>

            <Row gutter={16}>
                <Form
                    form={form}
                    onFinish={formValues => setFormParams({ ...formParams, ...formValues, page: 1 })}
                    layout="vertical"
                    style={{ minWidth: '100%', padding: 20 }}
                >
                    <Form.Item label="Название" name="name">
                        <Input autoComplete="name" />
                    </Form.Item>

                    <Row justify="center">
                        <Button style={{ margin: 10 }} type="primary" htmlType="submit">
                            Поиск
                        </Button>
                        <Button style={{ margin: 10 }} onClick={() => form.resetFields()}>
                            Сбросить
                        </Button>
                    </Row>
                </Form>
            </Row>

            <Row gutter={16}>
                <Col span={24}>
                    <Row>
                        {data.content.length === 0 ? (
                            <h2>Список пуст</h2>
                        ) : (
                            data.content.map(item => (
                                <CategoryCard key={item.id} item={item} handleDelete={handleDelete} />
                            ))
                        )}
                    </Row>
                </Col>
            </Row>

            <Row justify="center" style={{ marginTop: '25px' }}>
                <Pagination
                    showTotal={(total, range) => `${range[0]}-${range[1]} из ${total} записей`}
                    current={formParams.page}
                    defaultPageSize={formParams.size}
                    total={data.totalElements}
                    onChange={handlePageChange}
                    pageSizeOptions={[1, 2, 5, 10]}
                    showSizeChanger
                />
            </Row>
        </div>
    );
};

export default CategoryListPage;
