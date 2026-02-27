import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CryptoTable, CryptoGrid } from './CryptoTable';
import { SORT_OPTIONS, CURRENCY_OPTIONS } from '../constants/cryptoColumns';
import { Table, Grid, RefreshCw } from 'lucide-react';

// View Mode Toggle Component - Pure UI, no business logic
export const ViewModeToggle = ({ viewMode, onViewModeChange, className = "" }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Button
        variant={viewMode === 'table' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewModeChange('table')}
      >
        <Table className="h-4 w-4 mr-2" />
        Table
      </Button>
      <Button
        variant={viewMode === 'grid' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewModeChange('grid')}
      >
        <Grid className="h-4 w-4 mr-2" />
        Grid
      </Button>
    </div>
  );
};

// Controls Panel Component - Pure UI, no business logic
export const ControlsPanel = ({ 
  sortBy, 
  currency, 
  limit, 
  onSortChange, 
  onCurrencyChange, 
  onLimitChange,
  onRefresh,
  isLoading = false,
  className = "" 
}) => {
  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 sm:flex-none">
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 sm:flex-none">
            <Select value={currency} onValueChange={onCurrencyChange}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 sm:flex-none">
            <Select value={limit.toString()} onValueChange={(value) => onLimitChange(parseInt(value))}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="250">250</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Dashboard Header Component - Pure UI, no business logic
export const DashboardHeader = ({ title, description, children, className = "" }) => {
  return (
    <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${className}`}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
};

// Main Content Component - Pure UI, no business logic
export const MainContent = ({ 
  viewMode, 
  data, 
  isLoading, 
  onSort, 
  onRefresh, 
  onViewDetails, 
  currency, 
  sortBy,
  className = "" 
}) => {
  return (
    <div className={className}>
      {viewMode === 'table' ? (
        <CryptoTable
          data={data}
          isLoading={isLoading}
          onSort={onSort}
          onRefresh={onRefresh}
          onViewDetails={onViewDetails}
          currency={currency}
          sortBy={sortBy}
        />
      ) : (
        <CryptoGrid
          data={data}
          isLoading={isLoading}
          onViewDetails={onViewDetails}
        />
      )}
    </div>
  );
};

// Error State Component - Pure UI, no business logic
export const ErrorState = ({ message = "Error loading cryptocurrency data", onRetry, className = "" }) => {
  return (
    <div className={`text-center py-8 ${className}`}>
      <p className="text-red-500 mb-4">{message}</p>
      <Button onClick={onRetry}>Try Again</Button>
    </div>
  );
};

// Combined Controls Component - All controls in one place
export const DashboardControls = ({ 
  viewMode, 
  sortBy, 
  currency, 
  limit, 
  isLoading,
  onViewModeChange, 
  onSortChange, 
  onCurrencyChange, 
  onLimitChange,
  onRefresh,
  className = "" 
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <ControlsPanel
        sortBy={sortBy}
        currency={currency}
        limit={limit}
        onSortChange={onSortChange}
        onCurrencyChange={onCurrencyChange}
        onLimitChange={onLimitChange}
        onRefresh={onRefresh}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DashboardControls;
