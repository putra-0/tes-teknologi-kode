<?php

namespace App\Enums;

enum ResponseCode: string
{
    case Ok = '20000';
    case BadRequest = '40000';
    case Unauthorized = '40100';
    case InvalidOtp = '40101';
    case Forbidden = '40300';
    case NotFound = '40400';
    case MethodNotAllowed = '40500';
    case Conflict = '40900';
    case SessionExpired = '41900';
    case TooManyRequests = '42900';
    case InternalServerError = '50000';
    case BadGateway = '50200';

    public function getMessage(): string
    {
        return str()->headline($this->name);
    }
}
