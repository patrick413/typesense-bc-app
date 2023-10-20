import { Box, Button, H1, HR, Text } from '@bigcommerce/big-design';
import { ArrowBackIcon } from '@bigcommerce/big-design-icons';
import { useRouter } from 'next/router';
import { TabIds, TabRoutes } from './header';

const InnerHeader = () => {
    const router = useRouter();

    const handleBackClick = () => router.push(TabRoutes[TabIds.CONFIG]);

    return (
        <Box marginBottom="xxLarge">
            <Button iconLeft={<ArrowBackIcon color="secondary50" />} variant="subtle" onClick={handleBackClick}>
                <Text bold color="secondary50">Collections</Text>
            </Button>
                <H1>Collections</H1>
            <HR color="secondary30" />
        </Box>
    );
};

export default InnerHeader;
