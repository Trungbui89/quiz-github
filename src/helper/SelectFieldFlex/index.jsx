import React from 'react';
import { FormControl, FormHelperText } from '@material-ui/core';

import { colors } from '../../constants/colors';
import { Box, Grid, Typography } from '@mui/material';
import Select, { components } from 'react-select';
import './styles.scss';

const SelectFieldFlex = (props) => {
    const {
        name,
        data,
        onAddAutoComplete,
        widthElement,
        selectInTable,
        onClick,
        readOnly,
        validateSearch,
        placeholder,
        isNotRefresh,
        apiName,
        isDisableFullWidth,
        isDisable,
        disabled,
        defaultValue,
        title,
        require,
        error,
        handleOnChange,
        customClasses,
        length,
        propStyles,
        register,
        control,
        hiddenClear,
        className,
    } = props;
    const valueOptions = data.filter(
        (option) =>
            option.value === defaultValue ||
            option.value === defaultValue?.value,
    );
    const isError = Boolean(error);
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            background: isDisable ? colors.borderGray : colors.white,
            borderColor: validateSearch
                ? colors.borderGray
                : isError
                ? colors.pink
                : disabled
                ? colors.borderGray
                : colors.mediumGray,
            minHeight: '35px',
            height: '35px',
            borderWidth: '1px',
            borderRadius: '5px',
            boxShadow: state.isFocused ? 0 : 0,
            '& focus': {
                borderColor: colors.blue,
            },
            '&:hover': {
                borderColor: colors.blue,
            },
        }),
        valueContainer: (provided) => ({
            ...provided,
            height: '31px',
            padding: '0 6px',
        }),
        input: (provided) => ({
            ...provided,
            margin: '0px',
        }),
        indicatorsContainer: (provided) => ({
            ...provided,
            height: '31px',
        }),
        option: (base) => ({
            ...base,
        }),
        menuList: (base) => ({
            ...base,
            // kill the white space on first and last option
            padding: 0,
            overflowY: 'auto',
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        menu: (provided, state) => ({
            ...provided,
            marginTop: 0,
            zIndex: 9999,
        }),
    };
    const customOnTableStyles = {
        ...customStyles,
        control: (provided, state) => ({
            ...provided,
            background: disabled ? colors.gray : colors.white,
            borderColor: isError ? colors.pink : colors.white,
            marginTop: isError ? '10px' : '0px',
            minHeight: '35px',
            height: '35px',
            boxShadow: state.isFocused ? 0 : 0,
            '& focus': {
                borderColor: colors.blue,
            },
            '&:hover': {
                borderColor: colors.blue,
            },
        }),
        dropdownIndicator: (provided, state) => ({
            ...provided,
            display: state.isFocused ? 'flex' : 'none',
        }),
        indicatorSeparator: (provided, state) => ({
            ...provided,
            display: state.isFocused ? 'flex' : 'none',
        }),
        clearIndicator: (provided, state) => ({
            ...provided,
            display: state.isFocused ? 'flex' : 'none',
        }),
        placeholder: (provided, state) => ({
            ...provided,
            fontStyle: 'italic',
            display: state.isFocused ? 'flex' : 'none',
            maxWidth: 'calc(100% - 8px)',
            overflow: 'hidden',
            position: 'absolute',
            textOverFlow: 'ellipsis',
            whiteSpace: 'nowrap',
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    };
    return (
        <>
            <FormControl
                style={{
                    width: widthElement ? widthElement : `${90 / length}%`,
                    ...propStyles,
                }}
                fullWidth={!isDisableFullWidth}
            >
                <Grid container spacing={2}  style={{marginTop: 20}}>
                    <Grid item xs={4}>
                        {require ? (
                            <Box display="flex">
                                <Typography className="title-vertical-inline">
                                    {title}
                                </Typography>
                                <Typography>*</Typography>
                            </Box>
                        ) : (
                            <Typography className="title-vertical-inline">
                                {title}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={8}>
                        <Select
                            // {...inputProps}
                            className={className}
                            fullWidth
                            isDisabled={isDisable}
                            defaultValue={defaultValue || undefined}
                            value={
                                defaultValue?.value
                                    ? defaultValue
                                    : valueOptions
                            }
                            onChange={
                                handleOnChange
                                    ? (val) => handleOnChange(name, val)
                                    : null
                            }
                            options={data}
                            classNamePrefix="select"
                            styles={
                                selectInTable
                                    ? customOnTableStyles
                                    : customStyles
                            }
                            autosize
                            menuShouldBlockScroll
                            menuPosition="fixed"
                            maxMenuHeight={190}
                            noOptionsMessage={() => 'Kh??ng t??m th???y k???t qu???'}
                            isClearable={!readOnly && !hiddenClear}
                            menuIsOpen={readOnly ? false : undefined}
                            isSearchable={!readOnly}
                            placeholder={
                                <p style={{ color: 'black' }}>{placeholder}</p>
                            }
                            name={name}
                            control={control}
                        />
                        <FormHelperText>
                            {isError && error.message}
                        </FormHelperText>
                    </Grid>
                </Grid>
            </FormControl>
        </>
    );
};
export default SelectFieldFlex;
