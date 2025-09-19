<?php

namespace App\EventListener;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;

class CorsListener
{
    public function onKernelRequest(RequestEvent $event): void
    {
        // Don't do anything if it's not the master request.
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();
        $method = $request->getRealMethod();
        $origin = $request->headers->get('Origin');

        // Allowed origins
        $allowedOrigins = [
            'https://vncompare.com',
            'https://www.vncompare.com',
            'https://admin.vncompare.com',
            'https://vncompare-backoffice.netlify.app',
            'http://localhost:3000',
            'http://localhost:3001'
        ];

        if ($method === 'OPTIONS') {
            $response = new Response();
            
            if (in_array($origin, $allowedOrigins)) {
                $response->headers->set('Access-Control-Allow-Origin', $origin);
            } else {
                $response->headers->set('Access-Control-Allow-Origin', '*');
            }
            
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, X-API-Version');
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
            $response->headers->set('Access-Control-Max-Age', '3600');
            $event->setResponse($response);
        }
    }

    public function onKernelResponse(ResponseEvent $event): void
    {
        // Don't do anything if it's not the master request.
        if (!$event->isMainRequest()) {
            return;
        }

        $response = $event->getResponse();
        $request = $event->getRequest();
        $origin = $request->headers->get('Origin');

        // Allowed origins
        $allowedOrigins = [
            'https://vncompare.com',
            'https://www.vncompare.com',
            'https://admin.vncompare.com',
            'https://vncompare-backoffice.netlify.app',
            'http://localhost:3000',
            'http://localhost:3001'
        ];

        if (in_array($origin, $allowedOrigins)) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
        } else {
            $response->headers->set('Access-Control-Allow-Origin', '*');
        }
        
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, X-API-Version');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
    }
}
