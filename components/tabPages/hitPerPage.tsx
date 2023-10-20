import { Box, Form, H2, Input, Small } from '@bigcommerce/big-design';
import React from 'react';

const HitPerPage = ({ searchConfig, updateHandler }) => {
  const { hitsPerPage } = searchConfig;

  const handleChange = (e, name) => {
    if (e.target.value <= 200) {
      updateHandler((prevConfig) => ({
        ...prevConfig,
        [name]: e.target.value,
      }));
    }
  };

  return (
    <Box marginLeft='xxxLarge'>
      <Box marginBottom="large">
        <H2>Hits per page</H2>
        <Small>Set the number of search results per page</Small>
        <Small>Default: 20</Small>
      </Box>
      <Form>
        <Input
          type='number'
          max="100"
          required
          placeholder={hitsPerPage}
          value={hitsPerPage}
          onChange={(e) => handleChange(e, 'hitsPerPage')}
        />
      </Form>
    </Box>
  );
};

export default HitPerPage;
